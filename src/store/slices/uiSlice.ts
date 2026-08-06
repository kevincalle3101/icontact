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
    dni: '72749143',
    name: 'Rosa Stefania Gerónimo Llanos',
    bonusDni: '72749143',
    driverObservation: '',
    managerDiscountApplied: false,
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
    toggleManagerDiscount(state) {
      state.payment.managerDiscountApplied = !state.payment.managerDiscountApplied;
    },
    setPaymentField(
      state,
      action: PayloadAction<{ field: keyof PaymentDetails; value: any }>,
    ) {
      (state.payment as any)[action.payload.field] = action.payload.value;
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
  toggleManagerDiscount,
  setPaymentField,
  resetPayment,
  tickTmo,
} = uiSlice.actions;
export default uiSlice.reducer;
