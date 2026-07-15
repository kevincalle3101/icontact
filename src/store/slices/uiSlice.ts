import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaymentDetails } from '@/types';

interface UiState {
  storeMessage: string;
  managerMessage: string;
  tmoSeconds: number;
  payment: PaymentDetails;
}

const initialState: UiState = {
  storeMessage: '40 MIN  NO HOTWINGS, NO BIG CRUNCH',
  managerMessage: 'BIENVENIDA CORTA, BANDERA AZUL',
  tmoSeconds: 210,
  payment: {
    method: 'soles',
    amount: 0,
    exactPayment: false,
    invoiceType: 'boleta',
    dni: '',
    name: '',
    driverObservation: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPaymentMethod(state, action: PayloadAction<PaymentDetails['method']>) {
      state.payment.method = action.payload;
    },
    setPaymentAmount(state, action: PayloadAction<number>) {
      state.payment.amount = action.payload;
    },
    setExactPayment(state, action: PayloadAction<boolean>) {
      state.payment.exactPayment = action.payload;
    },
    setInvoiceType(state, action: PayloadAction<PaymentDetails['invoiceType']>) {
      state.payment.invoiceType = action.payload;
    },
    setPaymentField(
      state,
      action: PayloadAction<{ field: 'dni' | 'name' | 'driverObservation'; value: string }>,
    ) {
      state.payment[action.payload.field] = action.payload.value;
    },
    resetPayment(state) {
      state.payment = initialState.payment;
    },
    tickTmo(state) {
      state.tmoSeconds = Math.max(0, state.tmoSeconds - 1);
    },
  },
});

export const {
  setPaymentMethod,
  setPaymentAmount,
  setExactPayment,
  setInvoiceType,
  setPaymentField,
  resetPayment,
  tickTmo,
} = uiSlice.actions;
export default uiSlice.reducer;
