import clsx from '@/utils/clsx';
import type { PaymentMethod as PaymentMethodType } from '@/types';

// Options matching screenshot: Soles, Dólares, Tarjeta o Yape
const OPTIONS: { value: PaymentMethodType; label: string; icon: string }[] = [
  { value: 'soles', label: 'Soles', icon: '💵' },
  { value: 'usd', label: 'Dólares', icon: '💵' },
  { value: 'tarjeta', label: 'Tarjeta o Yape', icon: '💳' },
];

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (value: PaymentMethodType) => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div role="radiogroup" aria-label="Medio de pago" className="grid grid-cols-3 gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            'flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-xs font-semibold transition-all',
            value === option.value
              ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-2xs ring-1 ring-blue-500/30'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          <span className="text-xl" aria-hidden="true">
            {option.icon}
          </span>
          <span className="text-[11px] text-center leading-tight">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
