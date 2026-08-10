import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { FiCheckCircle } from 'react-icons/fi';
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
import type { InvoiceType as InvoiceTypeValue } from '@/types';

interface PagoSectionProps {
  embedded?: boolean;
}

export default function PagoSection({ embedded = false }: PagoSectionProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const payment = useAppSelector((state) => state.ui.payment);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Discount calculation
  const discountAmount = payment.managerDiscountApplied ? subtotal * 0.10 : 0;
  const total = Math.max(0, subtotal - discountAmount);

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

  // Handle Amount change & USD Pop-up requirement
  const handleAmountChange = (newAmount: number) => {
    dispatch(setPaymentAmount(newAmount));

    // Requirement: "Al seleccionar Medio de pago: Dólares y Monto 100 o más debe activarse un pop un de Se acepta hasta la denominación de $ 50.00"
    if (payment.method === 'usd' && newAmount >= 100) {
      toast.info('Se acepta hasta la denominación de $ 50.00', {
        toastId: 'usd-denomination-alert',
      });
    }
  };

  const handleExactPaymentToggle = (checked: boolean) => {
    dispatch(setExactPayment(checked));
    if (checked) {
      dispatch(setPaymentAmount(total));
    }
  };

  const onSubmit = handleSubmit((values) => {
    dispatch(setPaymentField({ field: 'dni', value: values.dni }));
    dispatch(setPaymentField({ field: 'name', value: values.name }));
    dispatch(
      setPaymentField({ field: 'driverObservation', value: values.driverObservation ?? '' }),
    );

    if (items.length === 0) {
      toast.error('El pedido está vacío');
      return;
    }

    if (payment.amount < total && !payment.exactPayment) {
      toast.error(`El monto es menor al total del pedido (S/ ${total.toFixed(2)})`);
      return;
    }

    setShowConfirmationModal(true);
  });

  const handleFinishOrder = () => {
    toast.success('Pedido enviado correctamente');
    dispatch(clearCart());
    setShowConfirmationModal(false);
    navigate('/cliente');
  };

  const pagoFormBody = (
    <>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Medio de pago:
          </h3>
          <button
            type="button"
            onClick={() => dispatch(toggleManagerDiscount())}
            className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-tight uppercase transition-colors ${
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
          onChange={(v) => {
            dispatch(setPaymentMethod(v));
            if (v === 'usd' && payment.amount >= 100) {
              toast.info('Se acepta hasta la denominación de $ 50.00');
            }
          }}
        />
      </div>

      <AmountInput
        value={payment.amount}
        total={total}
        currencySymbol={payment.method === 'usd' ? '$' : 'S/'}
        onChange={handleAmountChange}
        disabled={payment.exactPayment}
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
          disabled={items.length === 0}
          className={`w-full rounded-xl py-3 text-[14px] font-bold uppercase tracking-wider transition-colors ${
            items.length === 0
              ? 'bg-[#c8d6e5] text-white cursor-not-allowed'
              : 'bg-[#1a1f5e] text-white shadow-sm hover:bg-[#252b7a]'
          }`}
        >
          CONTINUAR
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch(clearCart());
            toast.info('Pedido cancelado');
          }}
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
          <div className="mt-4 border-t border-slate-200 pt-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-[#7b869d]">
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
          actions={
            <button
              type="button"
              onClick={() => dispatch(toggleManagerDiscount())}
              className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-tight uppercase transition-colors ${
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

      {/* Confirmation Modal (Sección Mensaje de Despedida) */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FiCheckCircle size={28} />
            </div>
            <h3 className="text-[13px] font-bold text-slate-900 uppercase">
              ¡Pedido Listo para Confirmar!
            </h3>
            <p className="mt-1 text-[10px] text-slate-500">
              Revise el resumen final del pedido antes de enviar a cocina.
            </p>

            <div className="my-4 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span>Cliente:</span>
                <span className="font-bold">{payment.name}</span>
              </div>
              <div className="flex justify-between">
                <span>DNI / RUC:</span>
                <span className="font-bold">{payment.dni}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span>Subtotal:</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              {payment.managerDiscountApplied && (
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>Descuento Gerencial (10%):</span>
                  <span>- S/ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              {/* Requirement: "El campo Total muestra el Total de la Sección Detalle del pedido, no el Subtotal" */}
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-sm text-slate-900">
                <span>Total Final:</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Modificar
              </button>
              <button
                type="button"
                onClick={handleFinishOrder}
                className="flex-1 rounded-xl bg-[#0f172a] py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
              >
                Confirmar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
