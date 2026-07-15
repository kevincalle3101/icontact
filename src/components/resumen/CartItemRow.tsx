import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) {
  return (
    <li className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-2xl" aria-hidden="true">
        {item.emoji}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-700">{item.name}</p>
        <p className="text-xs text-slate-400">{item.description}</p>
      </div>
      <div
        className="flex items-center gap-1.5"
        role="group"
        aria-label={`Cantidad de ${item.name}`}
      >
        <button
          type="button"
          onClick={() => onDecrement(item.productId)}
          aria-label={`Disminuir cantidad de ${item.name}`}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100"
        >
          <FiMinus size={12} aria-hidden="true" />
        </button>
        <span className="w-5 text-center text-sm font-semibold" aria-live="polite">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onIncrement(item.productId)}
          aria-label={`Aumentar cantidad de ${item.name}`}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100"
        >
          <FiPlus size={12} aria-hidden="true" />
        </button>
      </div>
      <span className="w-16 text-right text-sm font-bold text-slate-700">
        S/ {(item.price * item.quantity).toFixed(2)}
      </span>
      <button
        type="button"
        onClick={() => onRemove(item.productId)}
        aria-label={`Eliminar ${item.name} del pedido`}
        className="text-slate-400 hover:text-red-600"
      >
        <FiTrash2 aria-hidden="true" />
      </button>
    </li>
  );
}
