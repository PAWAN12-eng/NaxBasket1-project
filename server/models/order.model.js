import mongoose from "mongoose";

const orderschema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product"
        },
        product_details: {
          name: String,
          image: [String]
        },
        qty: Number
      }
    ],
    paymentId: {
      type: String,
      default: ""
    },
    payment_status: {
      type: String,
      default: ""
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
    subTotalAmt: {
      type: Number,
      default: 0
    },
    totalAmt: {
      type: Number,
      default: 0
    },
    invoice_receipt: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "cancelled", "shipped", "delivered"],
      default: "pending"
    }
  }, {
    timestamps: true
  });
  

const orderModel=mongoose.model('order',orderschema)

export default orderModel