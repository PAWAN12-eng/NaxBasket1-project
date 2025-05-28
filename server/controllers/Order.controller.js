import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import orderModel from "../models/order.model.js";
import UserModel from "../models/user.models.js";
import CartProductModel from "../models/cartproduct.model.js";
import Warehouse from "../models/warehouse.model.js";
import Address from "../models/address.model.js";
// import { findNearestWarehouse } from "../utils/findnearestlocation.js";

dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
// _______________________________________________________________________________________________
const getDistance = (coord1, coord2) => {
  const rad = (deg) => deg * (Math.PI / 180);
  const R = 6371; // km
  const dLat = rad(coord2.lat - coord1.lat);
  const dLng = rad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(coord1.lat)) *
      Math.cos(rad(coord2.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Cash on Delivery Controller
export const CashOnDeliveryController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmount, addressId, subTotalAmt } = req.body;

    // Validate user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = await Address.findById(addressId);
    if (!address || !address.coordinates?.lat || !address.coordinates?.lng) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid address or coordinates" 
      });
    }

    const warehouses = await Warehouse.find({
      active: true,
      coordinates: { $exists: true },
    });
    
    if (!warehouses.length) {
      return res.status(404).json({ 
        success: false, 
        message: "No active warehouses found" 
      });
    }

    // Find nearest warehouse
    let nearestWarehouse = null;
    let minDistance = Infinity;

    for (const warehouse of warehouses) {
      const dist = getDistance(address.coordinates, warehouse.coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWarehouse = warehouse;
      }
    }

    if (minDistance > 50) {
      return res.status(400).json({
        success: false,
        message: "Order not valid for this location",
      });
    }

    // Create order
    const orderId = uuidv4();
    const invoice_receipt = `INV-${Date.now()}`;
    
    const newOrder = await orderModel.create({
      userId,
      orderId,
      address: addressId,
      warehouse: nearestWarehouse._id,
      items: list_items.map(item => ({
        productId: item.productId._id,
        product_details: {
          name: item.productId.name,
          image: item.productId.image,
        },
        qty: item.quantity
      })),
      subTotalAmt,
      totalAmt: totalAmount,
      payment_status: "Pending",
      paymentId: "",
      invoice_receipt
    });

    // Clear cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne(
      { _id: userId }, 
      { $set: { shopping_cart: [] } }
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: await orderModel.findById(newOrder._id)
        .populate("userId", "name email mobile")
        .populate("address")
        .populate("warehouse")
    });
  } catch (err) {
    console.error("COD error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

// ✅ Razorpay: Create Order
export const createOrderByRezerPay = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { list_items, totalAmount, addressId, subTotalAmt } = req.body;

    const address = await Address.findById(addressId);
    if (!address?.coordinates?.lat || !address?.coordinates?.lng)
      return res.status(400).json({ success: false, message: "Invalid address or coordinates" });

    const warehouses = await Warehouse.find({ active: true, coordinates: { $exists: true } });
    if (!warehouses.length)
      return res.status(404).json({ success: false, message: "No active warehouses found" });

    let nearestWarehouse = null;
    let minDistance = Infinity;

    for (const warehouse of warehouses) {
      const dist = getDistance(address.coordinates, warehouse.coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWarehouse = warehouse;
      }
    }

    if (minDistance > 50) {
      return res.status(400).json({
        success: false,
        message: "Order not valid for this location",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    const newOrder = await orderModel.create({
      userId,
      orderId: uuidv4(),
      address: addressId,
      warehouse: nearestWarehouse._id,
      items: list_items.map(item => ({
        productId: item.productId._id,
        product_details: {
          name: item.productId.name,
          image: item.productId.image,
        },
        qty: item.quantity,
      })),
      subTotalAmt,
      totalAmt: totalAmount,
      payment_status: "Processing",
      paymentId: "",
      invoice_receipt: razorpayOrder.id,
    });

    const populatedOrder = await orderModel.findById(newOrder._id)
      .populate("userId", "name email mobile")
      .populate("address")
      .populate("warehouse");

    return res.status(201).json({
      success: true,
      message: "Razorpay order created",
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      data: populatedOrder,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// -------------------------------------------
// ✅ Razorpay: Verify Payment
export const VerifyPayment = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { invoice_receipt: razorpay_order_id },
      { payment_status: "Paid", paymentId: razorpay_payment_id },
      { new: true }
    ).populate("userId", "name email mobile");

    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { $set: { shopping_cart: [] } });

    return res.status(200).json({
      success: true,
      message: "Payment verified and order updated",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get User Orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ userId })
      .populate({
        path: "items.productId",
        select: "name image price discount",
      })
      .populate("address")
      .populate("warehouse")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error("Get user orders error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getWarehouseOrders = async (req, res) => {
  try {
    const warehouseId = req.params.id;
    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse || !warehouse.coordinates?.lat || !warehouse.coordinates?.lng) {
      return res.status(400).json({ success: false, message: "Warehouse coordinates not found" });
    }

    // Fetch all orders for the warehouse
    const orders = await orderModel
      .find({ warehouse: warehouseId })
      .populate("items.productId") // populate product inside each item
      .populate("address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Add distance calculation to each order
    const enrichedOrders = orders.map((order) => {
      const userCoords = order.address?.coordinates;
      let distance = null;

      if (userCoords?.lat && userCoords?.lng) {
        distance = getDistance(
          { lat: userCoords.lat, lng: userCoords.lng },
          { lat: warehouse.coordinates.lat, lng: warehouse.coordinates.lng }
        ).toFixed(2); // km rounded to 2 decimal
      }

      return {
        ...order.toObject(),
        distanceFromWarehouseKm: distance,
      };
    });

    // Order status summary for this warehouse
    const [totalOrders, acceptedOrders, cancelledOrders, pendingOrders,deliveredOrders] = await Promise.all([
      orderModel.countDocuments({ warehouse: warehouseId }),
      orderModel.countDocuments({ warehouse: warehouseId, status: "accepted" }),
      orderModel.countDocuments({ warehouse: warehouseId, status: "cancelled" }),
      orderModel.countDocuments({ warehouse: warehouseId, status: "pending" }),
      orderModel.countDocuments({ warehouse: warehouseId, status: "delivered" }),
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalOrders,
        acceptedOrders,
        cancelledOrders,
        pendingOrders,
        deliveredOrders
      },
      orders: enrichedOrders,
    });

  } catch (err) {
    console.error("Warehouse order fetch error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["accepted", "cancelled", "shipped", "delivered"];

  if (!orderId || !allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("userId address warehouse");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully`,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// online payment using rezerpay



