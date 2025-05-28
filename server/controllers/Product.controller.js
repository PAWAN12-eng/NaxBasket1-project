import productModel from "../models/product.model.js";
import subcategoryModel from "../models/subcategory.model.js";
import categoryModel from "../models/category.model.js";
import mongoose from "mongoose";

import warehouseStockModel from "../models/warehouseProductStock.model.js";
import warehouseModel from "../models/warehouse.model.js";
// import productModel from "../models/product.model.js";
import haversine from "haversine-distance";
import { logActivity } from "./External.controller.js";

function findNearestWarehouse(userLocation, warehouses) {
    let nearest = null;
    let minDistance = Infinity;

    warehouses.forEach(warehouse => {
        const distance = haversine(userLocation, {
            latitude: warehouse.location.lat,
            longitude: warehouse.location.lng
        });
        if (distance < minDistance) {
            minDistance = distance;
            nearest = warehouse;
        }
    });

    return nearest;
}

export async function getProductsByUserLocation(req, res) {
    try {
        const { latitude, longitude } = req.body;

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

        // Fetch stock from nearest warehouse
        const warehouseStocks = await warehouseStockModel.find({ warehouse: nearest._id })
            .populate("product");

        return res.json({
            message: "Products near your location",
            success: true,
            error: false,
            warehouse: nearest.name,
            data: warehouseStocks
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Server error",
            success: false,
            error: true
        });
    }
}


export async function createProductController(req, res) {
    try {
        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details } = req.body;


        if (!name || !category || !subCategory || !unit || !stock || !price || !image[0] || !description) {
            return res.status(400).json({ message: "All required fields must be filled", error: true, success: false });
        }
        // ✅ Create a new product instance
        const newProduct = new productModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
        });

        // ✅ Save the product
        const saveProduct = await newProduct.save();

        await logActivity('product_added', `New product added: ${name}`);

        return res.json({
            message: 'Product Created Successfully',
            data: saveProduct,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function GetProducts(req, res) {
    try {
        // Fetch all products, populating category and subcategory details
        try {
            const products = await productModel.find().sort({ createdAt: -1 }).populate('category')
            res.json({ success: true, products });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch products', error });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getProductsBySubcategory(req, res) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json.status(400)({
                message: 'Provide categroy',
                success: false,
                error: true
            })
        }

        // Fetch products where the subCategory array contains the given subcategoryId
        const products = await productModel.find({
            category: { $in: id }
        }).limit(15)

        return res.json({
            message: 'category Product list',
            data: products,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function getProductByCategoryAndSubCategory(req, res) {
    try {
        const { categoryId, subCategoryId, page, limit } = req.body

        if (!categoryId || !subCategoryId) {
            return res.status(400).json({
                message: 'provide categoryId and SubCategoryId',
                error: true,
                success: false
            })
        }

        if (!page) {
            page = 1
        }

        if (!limit) {
            limit = 10
        }

        const query = {
            category: { $in: categoryId },
            subCategory: { $in: subCategoryId }
        }

        const skip = (page - 1) * limit


        const [data, dataCount] = await Promise.all([
            productModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            productModel.countDocuments(query)
        ])

        return res.json({
            message: 'Product list',
            data: data,
            totalCount: dataCount,
            page: page,
            limit: limit,
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getProductDetails(req, res) {
    try {
        const { ProductId } = req.body

        const product = await productModel.findOne({ _id: ProductId }).populate("category")  .populate("subCategory");



        return res.json({
            message:'product details',
            data:product,
            error:false,
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function searchProduct(req, res) {
    try {
        let { search, page, limit } = req.body;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const query = search ? { $text: { $search: search } } : {};

        const [data, totalCount] = await Promise.all([
            productModel.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .populate('category subCategory'),
            productModel.countDocuments(query)
        ]);

        return res.status(200).json({
            message: 'product data',
            success: true,
            error: false,
            data: data,
            totalCount: totalCount,
            page: page,
            totalPages: Math.ceil(totalCount / limit)
        });

    } catch (error) {
        console.error("🔥 searchProduct error:", error);
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Delete product controller
export async function deleteProductController(req, res) {
    try {
      const { id } = req.params; // get product id from URL params
  
      // Find and delete product by id
      const deletedProduct = await productModel.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product not found",
          success: false,
          error: true,
        });
      }
  
      // Optional: log activity
      await logActivity('product_delete', `Product deleted: ${deletedProduct.name}`);
  
      // Send success response with message and deleted product data
      return res.json({
        message: "Product deleted successfully",
        data: deletedProduct,
        success: true,
        error: false,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Server error",
        success: false,
        error: true,
      });
    }
  }
  

export async function ShowProductWithCategory(req, res) {
    try {
        // Fetch all categories with their respective products
        const categories = await categoryModel.find().lean();

        // Fetch all products with populated category and subcategory details
        const products = await productModel
            .find()
            .populate("category", "name") // Populate category name
            .populate("subCategory", "name") // Populate subcategory name
            .lean();

        // Structure the response by grouping products under their respective categories
        const categoryWithProducts = categories.map((category) => ({
            category: category.name,
            products: products.filter((product) =>
                product.category.some((cat) => cat._id.equals(category._id))
            ),
        }));

        res.status(200).json({ success: true, data: categoryWithProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


// **API Route to Fetch Product Details by ID**
export async function ProductById(req, res) {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}