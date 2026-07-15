import clsx from '@/utils/clsx';
import type { DeliveryChannel } from '@/types';

interface DeliveryTypeProps {
  value: DeliveryChannel;
  onChange: (channel: DeliveryChannel) => void;
}

export default function DeliveryType({ value, onChange }: DeliveryTypeProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Canal de venta"
      className="grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1"
    >
      {(['delivery', 'pickup'] as DeliveryChannel[]).map((channel) => (
        <button
          key={channel}
          type="button"
          role="radio"
          aria-checked={value === channel}
          onClick={() => onChange(channel)}
          className={clsx(
            'rounded-md px-3 py-2 text-sm font-semibold capitalize transition-colors',
            value === channel
              ? 'bg-brand-navy text-white shadow'
              : 'text-slate-500 hover:bg-slate-200',
          )}
        >
          {channel === 'delivery' ? 'Delivery' : 'Pickup'}
        </button>
      ))}
    </div>
  );
}
