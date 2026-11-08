import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload; // { id, name, price, image, size, quantity }
      const existingIndex = state.cart.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingIndex >= 0) {
        state.cart[existingIndex].quantity += newItem.quantity;
      } else {
        state.cart.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.cart = state.cart.filter((item) => !(item.id === id && item.size === size));
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.cart.find((i) => i.id === id && i.size === size);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;