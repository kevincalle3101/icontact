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
            'flex flex-1 cursor-pointer flex-col items-center gap-[1px] rounded-[7px] border-[1.5px] px-[4px] py-[5px]',
            value === option.value
              ? 'border-[#1a1f5e] bg-[#f0f4ff]'
              : 'border-slate-200 bg-white',
          )}
        >
          <span
            className={clsx('text-[15px]', value !== option.value && 'grayscale opacity-60')}
            aria-hidden="true"
          >
            {option.icon}
          </span>
          <span
            className={clsx(
              'text-[9px] font-bold',
              value === option.value ? 'text-[#1a1f5e]' : 'text-slate-400',
            )}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
