import mongoose from "mongoose";
const warehouseSchema = new mongoose.Schema({
  name: String,
  location: String,
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  active: { type: Boolean, default: true }
  
});
// module.exports = mongoose.model('Warehouse', warehouseSchema);

const Warehouse= mongoose.model("Warehouse",warehouseSchema)

export default Warehouse
