import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import Input from '@/components/shared/Input';
import type { PaymentFormValues } from '@/components/pago/paymentFormSchema';

interface PaymentFormProps {
  register: UseFormRegister<PaymentFormValues>;
  errors: FieldErrors<PaymentFormValues>;
}

export default function PaymentForm({ register, errors }: PaymentFormProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Input label="DNI" inputMode="numeric" error={errors.dni?.message} {...register('dni')} />
      <Input label="Nombre" error={errors.name?.message} {...register('name')} />
      <div className="sm:col-span-2">
        <Input label="Observación Driver" {...register('driverObservation')} />
      </div>
    </div>
  );
}
