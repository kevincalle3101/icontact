import clsx from '@/utils/clsx';
import type { PaymentMethod as PaymentMethodType } from '@/types';

const OPTIONS: { value: PaymentMethodType; label: string; icon: string }[] = [
  { value: 'gerencial', label: 'Desc. Gerencial', icon: '🏷️' },
  { value: 'soles', label: 'Soles', icon: '💵' },
  { value: 'usd', label: 'USD', icon: '💲' },
  { value: 'tarjeta', label: 'Tarjeta', icon: '💳' },
];

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (value: PaymentMethodType) => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div role="radiogroup" aria-label="Medio de pago" className="grid grid-cols-4 gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            'flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-[11px] font-medium transition-colors',
            value === option.value
              ? 'border-brand-navy bg-brand-navy/10 text-brand-navy'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50',
          )}
        >
          <span aria-hidden="true">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
