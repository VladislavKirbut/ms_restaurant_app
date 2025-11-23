import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockApi, Dish } from '../../api/mockApi';

interface DishesState {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
}

const initialState: DishesState = {
  dishes: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDishesByRestaurant = createAsyncThunk(
  'dishes/fetchDishesByRestaurant',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const dishes = await mockApi.getDishesByRestaurant(restaurantId);
      return dishes;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllDishes = createAsyncThunk(
  'dishes/fetchAllDishes',
  async (_, { rejectWithValue }) => {
    try {
      const dishes = await mockApi.getAllDishes();
      return dishes;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDish = createAsyncThunk(
  'dishes/createDish',
  async (data: Omit<Dish, 'id'>, { rejectWithValue }) => {
    try {
      const dish = await mockApi.createDish(data);
      return dish;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDish = createAsyncThunk(
  'dishes/updateDish',
  async ({ id, updates }: { id: string; updates: Partial<Dish> }, { rejectWithValue }) => {
    try {
      const dish = await mockApi.updateDish(id, updates);
      return dish;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDish = createAsyncThunk(
  'dishes/deleteDish',
  async (id: string, { rejectWithValue }) => {
    try {
      await mockApi.deleteDish(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    clearDishes: (state) => {
      state.dishes = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch dishes by restaurant
    builder.addCase(fetchDishesByRestaurant.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDishesByRestaurant.fulfilled, (state, action) => {
      state.loading = false;
      state.dishes = action.payload;
    });
    builder.addCase(fetchDishesByRestaurant.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch all dishes
    builder.addCase(fetchAllDishes.fulfilled, (state, action) => {
      state.dishes = action.payload;
    });

    // Create dish
    builder.addCase(createDish.fulfilled, (state, action) => {
      state.dishes.push(action.payload);
    });

    // Update dish
    builder.addCase(updateDish.fulfilled, (state, action) => {
      const index = state.dishes.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.dishes[index] = action.payload;
      }
    });

    // Delete dish
    builder.addCase(deleteDish.fulfilled, (state, action) => {
      state.dishes = state.dishes.filter((d) => d.id !== action.payload);
    });
  },
});

export const { clearDishes } = dishesSlice.actions;
export default dishesSlice.reducer;
