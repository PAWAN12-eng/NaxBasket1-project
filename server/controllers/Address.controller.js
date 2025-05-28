import Address from "../models/address.model.js";

// CREATE user address
export const createUserAddress = async (req, res) => {
  try {
    const { addressLine, city, state, pincode, mobile, lat, lng, name, addressType, coordinates } = req.body;

    if (!addressLine || !city || !mobile || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const newAddress = new Address({
      userId: req.userId, 
      addressLine,
      city,
      state,
      pincode,
      mobile,
      lat,
      lng,
      name,
      addressType,
      coordinates,
    });

    await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error in createUserAddress:", error);
    return res.status(500).json({
      success: false,
      message:error.message || error,
    });
  }
};


// GET user address
export const getUserAddresses = async (req, res) => {
  try {
    // const addresses = await Address.find({ user: req.userId }).sort({ createdAt: -1 });
    const addresses = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error("Error in fatch user_address:", error);
    return res.status(500).json({
      success: false,
      message:error.message || error,
    });
  }
};

// UPDATE user address
export const updateUserAddress = async (req, res) => {
  try {
    await Address.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body);
    res.json({ success: true, message: "Address updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update address", error: err.message });
  }
};

// DELETE user address
export const deleteUserAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete address", error: err.message });
  }
};

