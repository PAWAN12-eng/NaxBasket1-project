// import mongoose from "mongoose";

// const addressSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   addressLine: String,
//   city: String,
//   state: String,
//   pincode: String,
//   mobile: String,
//   coordinates: {
//     lat: { type: Number, required: true },
//   lng: { type: Number, required: true },
//   }
// });
// const Address= mongoose.model("Address",addressSchema)

// export default Address

// models/address.model.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  addressLine: String,
  city: String,
  state: String,
  pincode: String,
  mobile: String,
  lat: Number,
  lng: Number,
  addressType: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);

export default Address;
