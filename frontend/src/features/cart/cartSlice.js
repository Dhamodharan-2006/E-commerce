import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage on app start
const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : { items: [], totalAmount: 0 };
  } catch {
    return { items: [], totalAmount: 0 };
  }
};

// Save cart to localStorage after every change
const saveCart = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch {}
};

const recalcTotal = (items) =>
  items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),   // ← loads persisted cart
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalAmount = recalcTotal(state.items);
      saveCart({ items: state.items, totalAmount: state.totalAmount });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.totalAmount = recalcTotal(state.items);
      saveCart({ items: state.items, totalAmount: state.totalAmount });
    },
    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      state.totalAmount = recalcTotal(state.items);
      saveCart({ items: state.items, totalAmount: state.totalAmount });
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      state.totalAmount = recalcTotal(state.items);
      saveCart({ items: state.items, totalAmount: state.totalAmount });
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;