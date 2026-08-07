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
      className="grid grid-cols-2 gap-3"
    >
      {(['delivery', 'pickup'] as DeliveryChannel[]).map((channel) => (
        <button
          key={channel}
          type="button"
          role="radio"
          aria-checked={value === channel}
          onClick={() => onChange(channel)}
          className={clsx(
            'rounded-xl py-2.5 px-4 text-xs font-bold transition-all text-center leading-none',
            value === channel
              ? 'bg-[#141b43] text-white shadow-2xs'
              : 'border border-[#cbd5e1] bg-white text-[#78859b] hover:bg-slate-50',
          )}
        >
          {channel === 'delivery' ? 'Delivery' : 'Pickup'}
        </button>
      ))}
    </div>
  );
}
