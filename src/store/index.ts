import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '@/store/slices/customerSlice';
import productsReducer from '@/store/slices/productsSlice';
import cartReducer from '@/store/slices/cartSlice';
import uiReducer from '@/store/slices/uiSlice';
import exchangeRateReducer from '@/store/slices/exchangeRateSlice';

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    products: productsReducer,
    cart: cartReducer,
    ui: uiReducer,
    exchangeRate: exchangeRateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
