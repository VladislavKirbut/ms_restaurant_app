import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi, Order } from '../../api/mockApi';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (
    orderData: {
      userId: string;
      restaurantId: string;
      items: { dishId: string; quantity: number }[];
      deliveryAddress: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const order = await mockApi.createOrder(orderData);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await mockApi.getOrder(id);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: string, { rejectWithValue }) => {
    try {
      const orders = await mockApi.getUserOrders(userId);
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await mockApi.getAllOrders();
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: string; status: Order['status'] }, { rejectWithValue }) => {
    try {
      const order = await mockApi.updateOrderStatus(id, status);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderPaymentStatus = createAsyncThunk(
  'orders/updateOrderPaymentStatus',
  async ({ id, paymentStatus }: { id: string; paymentStatus: Order['paymentStatus'] }, { rejectWithValue }) => {
    try {
      const order = await mockApi.updateOrderPaymentStatus(id, paymentStatus);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
      state.currentOrder = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch order
    builder.addCase(fetchOrder.fulfilled, (state, action) => {
      state.currentOrder = action.payload;
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    });

    // Fetch user orders
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });

    // Fetch all orders
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });

    // Update order status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    });

    // Update payment status
    builder.addCase(updateOrderPaymentStatus.fulfilled, (state, action) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    });
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
