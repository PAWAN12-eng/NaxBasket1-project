import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.models.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId
    const { productId } = req.body

    if (!productId) {
      return res.status(402).json({
        message: 'Provide productId',
        error: true,
        success: false
      })
    }

    const checkItmeCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId
    })

    if (checkItmeCart) {
      return res.status(400).json({
        message: 'Item already in cart'
      })
    }

    const cartItme = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId
    })

    const save = await cartItme.save()

    const updateCartUser = await UserModel.updateOne({ _id: userId }, {
      $push: {
        shopping_cart: productId
      }
    })

    return res.json({
      data: save,
      message: 'Item add successfully',
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const getCartItemContorller = async (req, res) => {
  try {
    const userId = req.userId

    const cartItems = await CartProductModel.find({
      userId: userId
    }).populate('productId')

    return res.json({
      data: cartItems,
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const updateCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId
    const { _id, qty } = req.body

    if (!_id || !qty) {
      return res.status(400).json({
        message: 'provide _id , qty'
      })
    }

    const updateCartItem = await CartProductModel.updateOne({
      _id: _id,
      userId: userId
    }, {
      quantity: qty
    })

    return res.json({
      message: "Item added",
      success: true,
      error: false,
      data: updateCartItem
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}

export const deleteCartItmeQtyController = async (req, res) => {
  try {
    const userId = req.userId
    const { _id } = req.body

    if (!_id) {
      return res.status(400).json({
        message: 'provide _id '
      })
    }
    const deleteCartItme = await CartProductModel.deleteOne({ _id: _id, userId: userId })

    return res.json({
      message: "Item remove",
      success: true,
      error: false,
      data: deleteCartItme
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}