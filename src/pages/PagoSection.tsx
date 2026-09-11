import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionContainer from '@/components/shared/SectionContainer';
import PaymentMethod from '@/components/pago/PaymentMethod';
import AmountInput from '@/components/pago/AmountInput';
import ExactPaymentCheckbox from '@/components/pago/ExactPaymentCheckbox';
import PaymentForm from '@/components/pago/PaymentForm';
import { paymentFormSchema, type PaymentFormValues } from '@/components/pago/paymentFormSchema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartItems, selectCartSubtotal, clearCart } from '@/store/slices/cartSlice';
import {
  setExactPayment,
  setInvoiceType,
  setPaymentAmount,
  setPaymentField,
  setPaymentMethod,
  toggleManagerDiscount,
} from '@/store/slices/uiSlice';
import { loadExchangeRate } from '@/store/slices/exchangeRateSlice';
import type { InvoiceType as InvoiceTypeValue } from '@/types';

interface PagoSectionProps {
  embedded?: boolean;
}

function formatEtaClock(minutesFromNow: number): string {
  const eta = new Date(Date.now() + minutesFromNow * 60000);
  const hours24 = eta.getHours();
  const minutes = eta.getMinutes().toString().padStart(2, '0');
  const period = hours24 >= 12 ? 'p. m.' : 'a. m.';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

const DELIVERY_ETA_MINUTES = 40;

export default function PagoSection({ embedded = false }: PagoSectionProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const payment = useAppSelector((state) => state.ui.payment);
  const exchangeRate = useAppSelector((state) => state.exchangeRate.rate);
  const { customer, deliveryChannel, storeInfo } = useAppSelector((state) => state.customer);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    dispatch(loadExchangeRate());
  }, [dispatch]);

  // Discount calculation
  const discountAmount = payment.managerDiscountApplied ? subtotal * 0.10 : 0;
  const total = Math.max(0, subtotal - discountAmount);
  // When paying in USD, the amount owed converts through the current rate
  const totalForPayment = payment.method === 'usd' && exchangeRate ? total / exchangeRate : total;
  // Card/Yape always charges the exact total: no cash tendered, so no vuelto/falta to compute
  const isCardOrYape = payment.method === 'tarjeta';

  useEffect(() => {
    if (isCardOrYape) {
      dispatch(setPaymentAmount(totalForPayment));
    }
  }, [isCardOrYape, totalForPayment, dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      invoiceType: payment.invoiceType || 'boleta',
      dni: payment.dni || '72749143',
      name: payment.name || 'Rosa Stefania Gerónimo Llanos',
      bonusDni: payment.bonusDni || '72749143',
      driverObservation: payment.driverObservation || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('dni', payment.dni);
    setValue('name', payment.name);
    setValue('driverObservation', payment.driverObservation);
  }, [payment.dni, payment.name, payment.driverObservation, setValue]);

  // Gates CONTINUAR: needs an amount to pay, a DNI/CE or RUC, and at least one
  // character for the name — matches the disabled state in OrderDeskLayout's
  // pinned button, which reads the same three fields from Redux.
  const dniValue = watch('dni') || '';
  const nameValue = watch('name') || '';
  const canContinue =
    items.length > 0 && payment.amount > 0 && dniValue.trim() !== '' && nameValue.trim() !== '';

  // Keeps Redux's dni/name live as the user types (not just on submit) — the
  // CONTINUAR button lives outside this component (in OrderDeskLayout, pinned
  // at the bottom of the panel) and needs these to compute its disabled state.
  useEffect(() => {
    const subscription = watch((values, { name: fieldName }) => {
      if (fieldName === 'dni') dispatch(setPaymentField({ field: 'dni', value: values.dni || '' }));
      if (fieldName === 'name') dispatch(setPaymentField({ field: 'name', value: values.name || '' }));
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  // Handle Amount change & USD Pop-up requirement
  const handleAmountChange = (newAmount: number) => {
    dispatch(setPaymentAmount(newAmount));
  };

  const handleExactPaymentToggle = (checked: boolean) => {
    dispatch(setExactPayment(checked));
    if (checked) {
      dispatch(setPaymentAmount(totalForPayment));
    }
  };

  const onSubmit = handleSubmit((values) => {
    dispatch(setPaymentField({ field: 'dni', value: values.dni }));
    dispatch(setPaymentField({ field: 'name', value: values.name }));
    dispatch(
      setPaymentField({ field: 'driverObservation', value: values.driverObservation ?? '' }),
    );

    if (items.length === 0) {
      return;
    }

    if (payment.amount < totalForPayment && !payment.exactPayment) {
      return;
    }

    setShowConfirmationModal(true);
  });

  const handleFinishOrder = () => {
    dispatch(clearCart());
    setShowConfirmationModal(false);
    navigate('/cliente');
  };

  const pagoFormBody = (
    <>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[10px] font-bold text-slate-500">
            Medio de pago:
          </h3>
          <button
            type="button"
            onClick={() => dispatch(toggleManagerDiscount())}
            className={`rounded-md px-[7px] py-[1px] text-[9px] font-bold tracking-tight transition-colors ${
              payment.managerDiscountApplied
                ? 'bg-[#1a1f5e] text-white shadow-xs'
                : 'bg-[#1a1f5e] text-white hover:bg-[#252b7a]'
            }`}
          >
            {payment.managerDiscountApplied ? 'Desc. Activo (10%)' : 'Desc. Gerencial'}
          </button>
        </div>
        <PaymentMethod
          value={payment.method}
          onChange={(v) => dispatch(setPaymentMethod(v))}
        />
      </div>

      <AmountInput
        value={payment.amount}
        total={totalForPayment}
        currencySymbol={payment.method === 'usd' ? '$' : 'S/'}
        exchangeRate={exchangeRate}
        onChange={handleAmountChange}
        disabled={payment.exactPayment || isCardOrYape}
        showDiffBox={!isCardOrYape}
      />

      <ExactPaymentCheckbox
        checked={payment.exactPayment}
        onChange={handleExactPaymentToggle}
      />

      <PaymentForm
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
        invoiceType={payment.invoiceType}
        onInvoiceTypeChange={(type: InvoiceTypeValue) => dispatch(setInvoiceType(type))}
      />
    </>
  );

  const pagoFormContent = (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} aria-label="Formulario de pago">
      {pagoFormBody}
      <div className="mt-2 flex flex-col items-center gap-2">
        <button
          type="submit"
          disabled={!canContinue}
          className={`w-full rounded-xl py-3 text-[14px] font-bold uppercase tracking-wider transition-colors ${
            !canContinue
              ? 'bg-[#c8d6e5] text-white cursor-not-allowed'
              : 'bg-[#1a1f5e] text-white shadow-sm hover:bg-[#252b7a]'
          }`}
        >
          CONTINUAR
        </button>
        <button
          type="button"
          onClick={() => dispatch(clearCart())}
          className="text-[10px] font-semibold text-slate-500 underline hover:text-slate-800"
        >
          Cancelar pedido
        </button>
      </div>
    </form>
  );

  return (
    <>
      {embedded ? (
        <>
          <div className="mt-4 mb-[10px] border-t border-slate-200 pt-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wide text-[#7b869d]">
              5. DETALLE DE PAGO
            </h2>
          </div>
          <form id="pago-form" className="flex flex-col gap-3" onSubmit={onSubmit} aria-label="Formulario de pago">
            {pagoFormBody}
          </form>
        </>
      ) : (
        <SectionContainer
          title="5. DETALLE DE PAGO"
          className="border border-slate-200 bg-white rounded-2xl shadow-xs"
          titleClassName="text-[10px]"
          actions={
            <button
              type="button"
              onClick={() => dispatch(toggleManagerDiscount())}
              className={`rounded-md px-[7px] py-[1px] text-[9px] font-bold tracking-tight transition-colors ${
                payment.managerDiscountApplied
                  ? 'bg-[#1a1f5e] text-white shadow-xs'
                  : 'bg-[#1a1f5e] text-white hover:bg-[#252b7a]'
              }`}
            >
              {payment.managerDiscountApplied ? 'Desc. Activo (10%)' : 'Desc. Gerencial'}
            </button>
          }
        >
          {pagoFormContent}
        </SectionContainer>
      )}

      {/* Confirmation Modal: Mensaje de Despedida */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[88vh] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="shrink-0 bg-[#0a0e2e] px-6 py-4 text-center">
              <span className="text-[15px] font-extrabold tracking-[1px] text-white">
                MENSAJE DE DESPEDIDA
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pt-4">
                <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.6px] text-[#8892b0]">
                  Detalle del pedido
                </div>

                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="mb-2.5 border-b border-[#f5f6fa] pb-2.5"
                  >
                    <div className="mb-1 flex justify-between text-[12px] font-bold text-[#1a1f5e]">
                      <span>
                        {item.quantity}x {item.emoji} {item.name}
                      </span>
                      <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.options?.map((group, gIdx) => (
                      <div key={gIdx} className="pl-2.5">
                        <div className="text-[10px] font-bold text-[#666666]">{group.category}</div>
                        {group.items.map((opt, oIdx) => (
                          <div key={oIdx} className="pl-2 text-[10px] text-[#888888]">
                            • {opt}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}

                <div className="flex justify-between pb-3.5">
                  <span className="text-[15px] font-extrabold text-[#1a1f5e]">TOTAL</span>
                  <span className="text-[15px] font-extrabold text-[#1a1f5e]">
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-y border-[#eef0f8] bg-[#f8f9fc] px-6 py-3.5">
                <p className="text-center text-[13px] leading-[1.8] text-[#333333]">
                  {deliveryChannel === 'pickup' ? (
                    <>
                      Estimado cliente, su pedido estará listo para recoger en{' '}
                      <strong className="text-[#1a1f5e]">{storeInfo.name}</strong>. Estará listo en{' '}
                      <strong className="text-[14px] text-[#e01020]">{DELIVERY_ETA_MINUTES} minutos</strong>{' '}
                      (a las {formatEtaClock(DELIVERY_ETA_MINUTES)}). Le avisaremos si hay algún
                      inconveniente.
                    </>
                  ) : (
                    <>
                      Estimado cliente, su pedido se enviará a{' '}
                      <strong className="text-[#1a1f5e]">
                        {`${customer?.address || ''} ${customer?.number || ''}`.trim()}
                      </strong>
                      . Llegará en{' '}
                      <strong className="text-[14px] text-[#e01020]">{DELIVERY_ETA_MINUTES} minutos</strong>{' '}
                      (a las {formatEtaClock(DELIVERY_ETA_MINUTES)}). El driver se comunicará con
                      usted.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 border-t border-[#eef0f8] px-6 py-3.5">
              <button
                type="button"
                onClick={handleFinishOrder}
                className="w-full rounded-[10px] bg-[#1a3ff5] py-[13px] text-[14px] font-extrabold tracking-[0.8px] text-white transition-colors hover:bg-[#1636d6]"
              >
                OK — ENVIAR PEDIDO
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="mt-[7px] w-full p-[3px] text-[12px] text-[#999999] hover:text-[#666666]"
              >
                ← Regresar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
