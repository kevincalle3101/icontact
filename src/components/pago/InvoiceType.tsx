import clsx from '@/utils/clsx';
import type { InvoiceType as InvoiceTypeValue } from '@/types';

interface InvoiceTypeProps {
  value: InvoiceTypeValue;
  onChange: (value: InvoiceTypeValue) => void;
}

export default function InvoiceType({ value, onChange }: InvoiceTypeProps) {
  return (
    <div role="radiogroup" aria-label="Tipo de comprobante" className="flex items-center gap-4">
      {(['boleta', 'factura'] as InvoiceTypeValue[]).map((option) => (
        <label
          key={option}
          className={clsx(
            'flex items-center gap-1.5 text-sm capitalize',
            value === option ? 'font-semibold text-brand-navy' : 'text-slate-600',
          )}
        >
          <input
            type="radio"
            name="invoiceType"
            checked={value === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 text-brand-navy focus:ring-brand-navy"
          />
          {option}
        </label>
      ))}
    </div>
  );
}
