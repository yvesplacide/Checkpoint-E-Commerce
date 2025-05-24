// src/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Charger le panier depuis localStorage
const getStoredCart = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { _id } = JSON.parse(userInfo);
    const storedCart = localStorage.getItem(`cart_${_id}`);
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

const initialState = {
  cartItems: getStoredCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((i) => i._id === item._id);

      if (existItem) {
        // Incrémente la quantité si le produit existe
        state.cartItems = state.cartItems.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        // Ajoute un nouveau produit
        state.cartItems.push({ ...item, qty: 1 });
      }

      // Sauvegarder dans localStorage avec l'ID de l'utilisateur
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { _id } = JSON.parse(userInfo);
        localStorage.setItem(`cart_${_id}`, JSON.stringify(state.cartItems));
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      // Sauvegarder dans localStorage avec l'ID de l'utilisateur
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { _id } = JSON.parse(userInfo);
        localStorage.setItem(`cart_${_id}`, JSON.stringify(state.cartItems));
      }
    },

    updateCartItemQuantity: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item._id === id ? { ...item, qty: qty } : item
      );
      // Sauvegarder dans localStorage avec l'ID de l'utilisateur
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { _id } = JSON.parse(userInfo);
        localStorage.setItem(`cart_${_id}`, JSON.stringify(state.cartItems));
      }
    },

    clearCart: (state) => {
      state.cartItems = [];
      // Supprimer le panier du localStorage
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { _id } = JSON.parse(userInfo);
        localStorage.removeItem(`cart_${_id}`);
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
