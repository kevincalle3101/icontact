import { useEffect } from 'react';
import type { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { PaymentFormValues } from '@/components/pago/paymentFormSchema';
import type { InvoiceType as InvoiceTypeValue } from '@/types';

interface PaymentFormProps {
  register: UseFormRegister<PaymentFormValues>;
  watch: UseFormWatch<PaymentFormValues>;
  setValue: UseFormSetValue<PaymentFormValues>;
  errors: FieldErrors<PaymentFormValues>;
  invoiceType: InvoiceTypeValue;
  onInvoiceTypeChange: (type: InvoiceTypeValue) => void;
}

export default function PaymentForm({
  register,
  watch,
  setValue,
  errors,
  invoiceType,
  onInvoiceTypeChange,
}: PaymentFormProps) {
  const dniValue = watch('dni') || '';
  const nameValue = watch('name') || '';
  const driverObsValue = watch('driverObservation') || '';

  // Requirement: "El campo DNI del Titular - Bonus debe replicar el ingresado en el campo DNI - Boleta"
  useEffect(() => {
    setValue('bonusDni', dniValue);
  }, [dniValue, setValue]);

  // Requirement: "En el campo Comprobante Boleta/Factura debe alertarse cuando no se alcanza el número de caracteres en DNI (8)/RUC (11)"
  const isDniLengthAlert =
    dniValue.length > 0 &&
    ((invoiceType === 'boleta' && dniValue.length < 8) ||
      (invoiceType === 'factura' && dniValue.length < 11));

  return (
    <div className="flex flex-col gap-2.5 text-[10px]">
      <div>
        <span className="mb-1 block font-semibold text-slate-700">Comprobante:</span>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-slate-700">
            <input
              type="radio"
              name="invoiceType"
              checked={invoiceType === 'boleta'}
              onChange={() => onInvoiceTypeChange('boleta')}
              className="h-4 w-4 accent-[#1a1f5e]"
            />
            Boleta
          </label>
          <label className="flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-slate-700">
            <input
              type="radio"
              name="invoiceType"
              checked={invoiceType === 'factura'}
              onChange={() => onInvoiceTypeChange('factura')}
              className="h-4 w-4 accent-[#1a1f5e]"
            />
            Factura
          </label>
        </div>
      </div>

      {/* Requirement: Renombrar el campo DNI por DNI/CE... */}
      <div>
        <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">
          {invoiceType === 'factura' ? 'RUC - Factura' : 'DNI/CE... - Boleta'}
        </label>
        <input
          type="text"
          maxLength={invoiceType === 'factura' ? 11 : 12}
          {...register('dni')}
          placeholder={invoiceType === 'factura' ? '11 dígitos RUC' : '8 dígitos DNI / CE'}
          className={`w-full rounded-lg border px-2.5 py-1.5 font-medium text-[10px] focus:outline-none ${
            isDniLengthAlert || errors.dni
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-slate-300 focus:border-slate-800'
          }`}
        />
        {/* Warning alert if characters count not reached */}
        {isDniLengthAlert && (
          <p className="mt-0.5 text-[10px] font-semibold text-amber-700">
            ⚠️ {invoiceType === 'boleta' ? 'DNI/CE requiere al menos 8 dígitos' : 'RUC requiere 11 dígitos'} ({dniValue.length}/{invoiceType === 'boleta' ? 8 : 11})
          </p>
        )}
        {errors.dni && !isDniLengthAlert && (
          <p className="mt-0.5 text-[10px] text-red-500">{errors.dni.message}</p>
        )}
      </div>

      {/* Requirement: Limit Nombre/Razón Social to 100 chars */}
      <div>
        <div className="flex justify-between items-center mb-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            {invoiceType === 'factura' ? 'Razón Social' : 'Nombre / Razón Social'}
          </label>
          <span className="text-[9px] text-slate-400">{nameValue.length}/100</span>
        </div>
        <input
          type="text"
          maxLength={100}
          {...register('name')}
          placeholder="Nombre o Razón Social"
          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-medium text-xs focus:border-slate-800 focus:outline-none"
        />
        {errors.name && <p className="mt-0.5 text-[10px] text-red-500">{errors.name.message}</p>}
      </div>

      {/* Requirement: DNI del Titular - Bonus replicates DNI from Boleta */}
      <div className="rounded-xl border border-amber-300 bg-amber-50/40 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-amber-600">
          <span className="text-xs">⭐</span>
          <h3 className="text-[9px] font-bold uppercase tracking-wide">
            Bonus — Acumulación de puntos
          </h3>
        </div>
        <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">
          DNI/CE del titular
        </label>
        <input
          type="text"
          {...register('bonusDni')}
          readOnly
          className="w-full rounded-lg border border-amber-300 bg-white px-2.5 py-1.5 text-[9px] font-medium text-slate-700 focus:outline-none"
          placeholder="Replicado automáticamente de Boleta"
        />
      </div>

      {/* Requirement: Limit Observación Driver to 100 chars */}
      <div>
        <label className="block text-[9px] font-semibold text-slate-700 mb-0.5">
          Observación Driver:
        </label>
        <textarea
          rows={3}
          maxLength={100}
          {...register('driverObservation')}
          placeholder="Escribe una observación para el driver..."
          className="w-full resize-none rounded-lg border border-slate-300 px-2.5 py-1.5 text-[9px] font-medium focus:border-slate-800 focus:outline-none"
        />
        <div className="mt-0.5 text-right text-[9px] text-slate-400">{driverObsValue.length}/100</div>
      </div>
    </div>
  );
}
