// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    productList: productReducer,
    cart: cartReducer,
    user: userReducer,
  },
});
