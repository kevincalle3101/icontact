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
      className="grid grid-cols-2 gap-2"
    >
      {(['delivery', 'pickup'] as DeliveryChannel[]).map((channel) => (
        <button
          key={channel}
          type="button"
          role="radio"
          aria-checked={value === channel}
          onClick={() => onChange(channel)}
          className={clsx(
            'rounded-xl py-2 px-3 text-xs font-bold transition-all text-center',
            value === channel
              ? 'bg-[#0b1021] text-white shadow-xs'
              : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          {channel === 'delivery' ? 'Delivery' : 'Pickup'}
        </button>
      ))}
    </div>
  );
}
