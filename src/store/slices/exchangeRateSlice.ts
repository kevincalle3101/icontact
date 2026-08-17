import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchExchangeRate } from '@/api/exchangeRateApi';
import type { RootState } from '@/store';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min: rate rarely changes intraday

interface ExchangeRateState {
  rate: number | null;
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
}

const initialState: ExchangeRateState = {
  rate: null,
  loading: false,
  error: null,
  fetchedAt: null,
};

export const loadExchangeRate = createAsyncThunk(
  'exchangeRate/load',
  async () => fetchExchangeRate(),
  {
    condition: (_arg, { getState }) => {
      const state = getState() as RootState;
      const { loading, fetchedAt } = state.exchangeRate;
      if (loading) return false;
      if (fetchedAt && Date.now() - fetchedAt < CACHE_TTL_MS) return false;
      return true;
    },
  },
);

const exchangeRateSlice = createSlice({
  name: 'exchangeRate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadExchangeRate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadExchangeRate.fulfilled, (state, action) => {
        state.loading = false;
        state.rate = action.payload;
        state.fetchedAt = Date.now();
      })
      .addCase(loadExchangeRate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al obtener el tipo de cambio';
      });
  },
});

export default exchangeRateSlice.reducer;
