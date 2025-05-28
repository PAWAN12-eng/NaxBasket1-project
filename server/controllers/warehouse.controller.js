import express from "express";
import Warehouse from "../models/warehouse.model.js";
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subcategory.model.js';
import OrderModel from '../models/order.model.js';
import mongoose from 'mongoose';
import ProductModel from '../models/product.model.js';
import WarehouseProductStock from '../models/warehouseProductStock.model.js';
import UserModel from "../models/user.models.js";

export async function getProductsByUserLocation(req, res) {
  try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
          return res.status(400).json({
              message: "User location required",
              success: false,
              error: true
          });
      }

      const warehouses = await warehouseModel.find(); // location: { lat, lng }

      const nearest = findNearestWarehouse({ latitude, longitude }, warehouses);

      if (!nearest) {
          return res.status(404).json({
              message: "No warehouse found near your location",
              success: false,
              error: true
          });
      }

      const warehouseStocks = await warehouseStockModel.find({ warehouse: nearest._id })
          .populate("product");

      return res.json({
          message: "Products near your location",
          success: true,
          error: false,
          warehouse: nearest.name,
          products: warehouseStocks
      });

  } catch (error) {
      res.status(500).json({
          message: error.message || "Server error",
          success: false,
          error: true
      });
  }
}

export const upsertStockForProduct = async (req, res) => {
  try {
    const { warehouseId, productId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!mongoose.Types.ObjectId.isValid(warehouseId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid warehouse or product ID' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a non-negative number' });
    }

    // Upsert stock
    const updated = await WarehouseProductStock.findOneAndUpdate(
      { product: productId, warehouse: warehouseId },
      { stock: quantity },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, message: 'Stock updated', data: updated });
  } catch (err) {
    res.status(500).json({ 
      success: false,     
      message: err.message || err,
    });
  }
};
// count all Categories Subcategories Products Orders Warehouses
export async function CountAllDetails(req, res) {
  try {
    const [
      categoryCount,
      subCategoryCount,
      productCount,
      orderCount,
      acceptedOrders,
      rejectedOrders,
      pendingOrders,
      warehouseCount,
      userCount, // ✅ added user count
      totalSalesAgg // ✅ added sales aggregation
    ] = await Promise.all([
      CategoryModel.countDocuments(),
      SubCategoryModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: "delivered" }),
      OrderModel.countDocuments({ status: "cancelled" }),
      OrderModel.countDocuments({ status: "pending" }),
      Warehouse.countDocuments(),
      UserModel.countDocuments(),
      OrderModel.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmt" } } }
      ])
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0; 
    res.json({
      success: true,
      data: {
        categories: categoryCount,
        subcategories: subCategoryCount,
        products: productCount,
        orders: orderCount,
        acceptedOrders,
        rejectedOrders,
        pendingOrders,
        warehouses: warehouseCount,
        users: userCount,
        totalSales        
      }
    });
  } catch (error) {
    console.error("Dashboard count error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching counts" });
  }
}

export async function getSalesStats(req, res) {
  try {
    const { timeFrame = 'daily' } = req.query;

    // IST offset in milliseconds (5 hours 30 minutes)
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Shift createdAt by IST_OFFSET_MS inside aggregation to convert UTC to IST
    // Use $add to add milliseconds to createdAt date

    let groupBy;

    if (timeFrame === 'daily') {
      groupBy = {
        year: { $year: { $add: ['$createdAt', IST_OFFSET_MS] } },
        month: { $month: { $add: ['$createdAt', IST_OFFSET_MS] } },
        day: { $dayOfMonth: { $add: ['$createdAt', IST_OFFSET_MS] } },
      };
    } else if (timeFrame === 'monthly') {
      groupBy = {
        year: { $year: { $add: ['$createdAt', IST_OFFSET_MS] } },
        month: { $month: { $add: ['$createdAt', IST_OFFSET_MS] } },
      };
    } else if (timeFrame === 'yearly') {
      groupBy = {
        year: { $year: { $add: ['$createdAt', IST_OFFSET_MS] } },
      };
    } else {
      // Default to daily
      groupBy = {
        year: { $year: { $add: ['$createdAt', IST_OFFSET_MS] } },
        month: { $month: { $add: ['$createdAt', IST_OFFSET_MS] } },
        day: { $dayOfMonth: { $add: ['$createdAt', IST_OFFSET_MS] } },
      };
    }

    const results = await OrderModel.aggregate([
      {
        $match: {
          status: { $in: ['accepted', 'completed', 'delivered'] },
          totalAmt: { $exists: true }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalSales: {
            $sum: {
              $cond: [
                { $isNumber: '$totalAmt' },
                '$totalAmt',
                { $toDouble: '$totalAmt' }
              ]
            }
          }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: { $ifNull: ['$_id.month', 1] },
              day: { $ifNull: ['$_id.day', 1] }
            }
          },
          totalSales: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching sales stats' });
  }
}


export async function getWarehouseDetails(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, data: warehouse });
  } catch (err) {
    console.error("Warehouse fetch error:", err);
    return res.status(500).json({
      message: "Error creating warehouse",
      error: true,
      success: false,
    });
  }
}
// Create warehouse (Admin) edited
export async function createWarehouse(req, res) {
  try {
    const { name, location, coordinates } = req.body;
    const warehouse = new Warehouse({ name, location, coordinates });
    await warehouse.save();
    res.json({ success: true, warehouse });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating warehouse",
      error: true,
      success: false,
    });
  }
}

// Toggle warehouse status
export async function ShowWareHouseStatus(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    // Flip the active status
    warehouse.active = !warehouse.active;
    await warehouse.save();

    return res.json({
      message: "Status updated successfully",
      error: false,
      success: true,
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating status",
      error: true,
      success: false,
    });
  }
}


// Get all warehouses
export async function GetAllWarehouse(req, res) {
  try {
    const warehouses = await Warehouse.find();
    res.json({ success: true, data: warehouses });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch warehouses" });
  }
}

// Delete warehouse
export async function deleteWarehouse(req, res) {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, message: "Warehouse deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting warehouse" });
  }
}

// Edit warehouse
export async function editWarehouse(req, res) {
  const { name, location, coordinates } = req.body;
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      {  name, location, coordinates },
      { new: true }
    );
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, message: "Warehouse updated", data: warehouse });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating warehouse" });
  }
}

// Get order stats grouped by each warehouse
export async function getOrderStatsByWarehouse(req, res) {
  try {
    const warehouses = await Warehouse.find();

    const results = await Promise.all(warehouses.map(async (warehouse) => {
      const [total, accepted, cancelled, pending] = await Promise.all([
        OrderModel.countDocuments({ warehouse: warehouse._id }),
        OrderModel.countDocuments({ warehouse: warehouse._id, status: 'accepted' }),
        OrderModel.countDocuments({ warehouse: warehouse._id, status: 'cancelled' }),
        OrderModel.countDocuments({ warehouse: warehouse._id, status: 'pending' }),
      ]);

      return {
        warehouseId: warehouse._id,
        warehouseName: warehouse.name,
        totalOrders: total,
        acceptedOrders: accepted,
        cancelledOrders: cancelled,
        pendingOrders: pending
      };
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching warehouse order stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


