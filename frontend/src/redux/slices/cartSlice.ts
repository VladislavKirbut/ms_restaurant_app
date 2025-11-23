import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantId: string;
  restaurantName: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  total: number;
}

const initialState: CartState = {
  items: [],
  restaurantId: null,
  total: 0,
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      
      // If cart has items from different restaurant, clear cart first
      if (state.restaurantId && state.restaurantId !== item.restaurantId) {
        state.items = [];
      }
      
      state.restaurantId = item.restaurantId;
      
      const existingItem = state.items.find((i) => i.dishId === item.dishId);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
      
      state.total = calculateTotal(state.items);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.dishId !== action.payload);
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
      
      state.total = calculateTotal(state.items);
    },
    
    updateQuantity: (state, action: PayloadAction<{ dishId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.dishId === action.payload.dishId);
      
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.dishId !== action.payload.dishId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      
      if (state.items.length === 0) {
        state.restaurantId = null;
      }
      
      state.total = calculateTotal(state.items);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
