import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import SectionContainer from '@/components/shared/SectionContainer';
import Button from '@/components/shared/Button';
import PaymentMethod from '@/components/pago/PaymentMethod';
import AmountInput from '@/components/pago/AmountInput';
import ExactPaymentCheckbox from '@/components/pago/ExactPaymentCheckbox';
import InvoiceType from '@/components/pago/InvoiceType';
import PaymentForm from '@/components/pago/PaymentForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCartItems, selectCartSubtotal, clearCart } from '@/store/slices/cartSlice';
import {
  setExactPayment,
  setInvoiceType,
  setPaymentAmount,
  setPaymentField,
  setPaymentMethod,
} from '@/store/slices/uiSlice';

const paymentSchema = z
  .object({
    dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
    name: z.string().min(1, 'Nombre requerido'),
    driverObservation: z.string(),
  })
  .strict();

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PagoSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const payment = useAppSelector((state) => state.ui.payment);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      dni: payment.dni,
      name: payment.name,
      driverObservation: payment.driverObservation,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    setValue('dni', payment.dni);
    setValue('name', payment.name);
    setValue('driverObservation', payment.driverObservation);
  }, [payment.dni, payment.name, payment.driverObservation, setValue]);

  const changeAmount = payment.amount > 0 ? payment.amount - subtotal : undefined;
  const isAmountValid = payment.exactPayment
    ? payment.amount === subtotal
    : payment.amount >= subtotal;

  const onSubmit = handleSubmit(
    (values) => {
      dispatch(setPaymentField({ field: 'dni', value: values.dni }));
      dispatch(setPaymentField({ field: 'name', value: values.name }));
      dispatch(
        setPaymentField({ field: 'driverObservation', value: values.driverObservation ?? '' }),
      );

      if (items.length === 0) {
        toast.error('El pedido está vacío');
        return;
      }
      if (payment.amount <= 0) {
        toast.error('Ingrese el monto de pago');
        return;
      }
      if (payment.exactPayment && payment.amount !== subtotal) {
        toast.error('El monto debe coincidir exactamente con el total');
        return;
      }
      if (!payment.exactPayment && payment.amount < subtotal) {
        toast.error('El monto ingresado es menor al total del pedido');
        return;
      }

      toast.success('Pedido confirmado correctamente');
      dispatch(clearCart());
      navigate('/cliente');
    },
    () => {
      toast.error('Revise los campos del formulario de pago');
    },
  );

  return (
    <SectionContainer title="5. Detalle de Pago" className="h-full">
      <form className="flex flex-col gap-4" onSubmit={onSubmit} aria-label="Formulario de pago">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Medio de pago</h3>
          <PaymentMethod value={payment.method} onChange={(v) => dispatch(setPaymentMethod(v))} />
        </div>

        <AmountInput
          value={payment.amount}
          onChange={(value) => dispatch(setPaymentAmount(value))}
          disabled={payment.exactPayment}
          changeAmount={changeAmount}
        />
        {!isAmountValid && payment.amount > 0 && (
          <p role="alert" className="text-xs text-red-600">
            El monto ingresado no cubre el total del pedido (S/ {subtotal.toFixed(2)}).
          </p>
        )}

        <ExactPaymentCheckbox
          checked={payment.exactPayment}
          onChange={(checked) => {
            dispatch(setExactPayment(checked));
            if (checked) dispatch(setPaymentAmount(subtotal));
          }}
        />

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Comprobante</h3>
          <InvoiceType value={payment.invoiceType} onChange={(v) => dispatch(setInvoiceType(v))} />
        </div>

        <PaymentForm register={register} errors={errors} />

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={items.length === 0}>
          CONTINUAR
        </Button>
        <button
          type="button"
          onClick={() => {
            dispatch(clearCart());
            toast.info('Pedido cancelado');
          }}
          className="self-center text-xs text-slate-400 underline underline-offset-2 hover:text-red-600"
        >
          Cancelar pedido
        </button>
      </form>
    </SectionContainer>
  );
}
