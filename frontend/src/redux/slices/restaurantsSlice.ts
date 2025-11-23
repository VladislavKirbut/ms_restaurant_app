import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi, Restaurant } from '../../api/mockApi';

interface RestaurantsState {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantsState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (filters?: { cuisine?: string; minRating?: number; maxDeliveryTime?: number }, { rejectWithValue }) => {
    try {
      const restaurants = await mockApi.getRestaurants(filters);
      return restaurants;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRestaurant = createAsyncThunk(
  'restaurants/fetchRestaurant',
  async (id: string, { rejectWithValue }) => {
    try {
      const restaurant = await mockApi.getRestaurant(id);
      return restaurant;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRestaurant = createAsyncThunk(
  'restaurants/createRestaurant',
  async (data: Omit<Restaurant, 'id'>, { rejectWithValue }) => {
    try {
      const restaurant = await mockApi.createRestaurant(data);
      return restaurant;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurants/updateRestaurant',
  async ({ id, updates }: { id: string; updates: Partial<Restaurant> }, { rejectWithValue }) => {
    try {
      const restaurant = await mockApi.updateRestaurant(id, updates);
      return restaurant;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurants/deleteRestaurant',
  async (id: string, { rejectWithValue }) => {
    try {
      await mockApi.deleteRestaurant(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch restaurants
    builder.addCase(fetchRestaurants.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRestaurants.fulfilled, (state, action) => {
      state.loading = false;
      state.restaurants = action.payload;
    });
    builder.addCase(fetchRestaurants.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch single restaurant
    builder.addCase(fetchRestaurant.fulfilled, (state, action) => {
      state.currentRestaurant = action.payload;
    });

    // Create restaurant
    builder.addCase(createRestaurant.fulfilled, (state, action) => {
      state.restaurants.push(action.payload);
    });

    // Update restaurant
    builder.addCase(updateRestaurant.fulfilled, (state, action) => {
      const index = state.restaurants.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.restaurants[index] = action.payload;
      }
      if (state.currentRestaurant?.id === action.payload.id) {
        state.currentRestaurant = action.payload;
      }
    });

    // Delete restaurant
    builder.addCase(deleteRestaurant.fulfilled, (state, action) => {
      state.restaurants = state.restaurants.filter((r) => r.id !== action.payload);
    });
  },
});

export const { clearCurrentRestaurant } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
