// store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  cart: []
};

const cartSlice = createSlice({
  name: "cartItem",
  initialState: initialValue,
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = [...action.payload];
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { handleAddItemCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
