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
    <div className="flex flex-col gap-2.5 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700">Comprobante:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onInvoiceTypeChange('boleta')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
              invoiceType === 'boleta'
                ? 'bg-[#0f172a] text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Boleta
          </button>
          <button
            type="button"
            onClick={() => onInvoiceTypeChange('factura')}
            className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
              invoiceType === 'factura'
                ? 'bg-[#0f172a] text-white'
                : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Factura
          </button>
        </div>
      </div>

      {/* Requirement: Renombrar el campo DNI por DNI/CE... */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
          {invoiceType === 'factura' ? 'RUC - Factura' : 'DNI/CE... - Boleta'}
        </label>
        <input
          type="text"
          maxLength={invoiceType === 'factura' ? 11 : 12}
          {...register('dni')}
          placeholder={invoiceType === 'factura' ? '11 dígitos RUC' : '8 dígitos DNI / CE'}
          className={`w-full rounded-lg border px-2.5 py-1.5 font-medium text-xs focus:outline-none ${
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
      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
          DNI/CE... del Titular - Bonus
        </label>
        <input
          type="text"
          {...register('bonusDni')}
          readOnly
          className="w-full rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 font-medium text-xs text-slate-600 cursor-not-allowed"
          placeholder="Replicado automáticamente de Boleta"
        />
      </div>

      {/* Requirement: Limit Observación Driver to 100 chars */}
      <div>
        <div className="flex justify-between items-center mb-0.5">
          <label className="block text-[11px] font-semibold text-slate-700">
            Observación Driver
          </label>
          <span className="text-[9px] text-slate-400">{driverObsValue.length}/100</span>
        </div>
        <input
          type="text"
          maxLength={100}
          {...register('driverObservation')}
          placeholder="Ej: Timbrar el intercomunicador..."
          className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 font-medium text-xs focus:border-slate-800 focus:outline-none"
        />
      </div>
    </div>
  );
}
