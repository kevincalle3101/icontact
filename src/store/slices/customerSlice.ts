import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchCustomerByPhone, updateCustomer } from '@/api/customerApi';
import { MOCK_STORE_INFO } from '@/data/mockData';
import type { Customer, DeliveryChannel, OrderHistoryItem, StoreInfo } from '@/types';

interface CustomerState {
  customer: Customer | null;
  orderHistory: OrderHistoryItem[];
  storeInfo: StoreInfo;
  deliveryChannel: DeliveryChannel;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customer: null,
  orderHistory: [],
  storeInfo: MOCK_STORE_INFO,
  deliveryChannel: 'delivery',
  loading: false,
  error: null,
};

export const loadCustomerByPhone = createAsyncThunk(
  'customer/loadByPhone',
  async (phone: string) => {
    const res = await fetchCustomerByPhone(phone);
    return res;
  },
);

export const saveCustomer = createAsyncThunk(
  'customer/save',
  async (customer: Partial<Customer> & { id: string }) => {
    return updateCustomer(customer);
  },
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setDeliveryChannel(state, action: PayloadAction<DeliveryChannel>) {
      state.deliveryChannel = action.payload;
    },
    setStoreInfo(state, action: PayloadAction<StoreInfo>) {
      state.storeInfo = action.payload;
    },
    updateCustomerField(state, action: PayloadAction<Partial<Customer>>) {
      if (state.customer) {
        state.customer = { ...state.customer, ...action.payload };
      }
    },
    clearCustomerError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomerByPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCustomerByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.customer;
        state.orderHistory = action.payload.orderHistory;
        state.storeInfo = action.payload.storeInfo;
      })
      .addCase(loadCustomerByPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al buscar cliente';
      })
      .addCase(saveCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(saveCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error al actualizar cliente';
      });
  },
});

export const { setDeliveryChannel, setStoreInfo, updateCustomerField, clearCustomerError } =
  customerSlice.actions;
export default customerSlice.reducer;
