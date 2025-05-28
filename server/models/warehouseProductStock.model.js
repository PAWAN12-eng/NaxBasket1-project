import mongoose from "mongoose";

const warehouseProductStockSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
  stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// export default mongoose.model("WarehouseProductStock", warehouseProductStockSchema);

const warehouseProductStock = mongoose.model('WarehouseProductStock', warehouseProductStockSchema);
export default warehouseProductStock;