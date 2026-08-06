import { useState } from 'react';
import { FiX, FiChevronUp, FiChevronDown, FiEdit3 } from 'react-icons/fi';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
  onUpdateKitchenObs?: (productId: string, obs: string) => void;
}

export default function CartItemRow({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onUpdateKitchenObs,
}: CartItemRowProps) {
  const [editingObs, setEditingObs] = useState(false);
  const [obsInput, setObsInput] = useState(item.kitchenObs || '');

  const handleSaveObs = () => {
    if (onUpdateKitchenObs) {
      onUpdateKitchenObs(item.productId, obsInput.trim());
    }
    setEditingObs(false);
  };

  return (
    <li className="flex flex-col border-b border-slate-200 py-2 text-xs last:border-b-0">
      {/* Top Main Row matching screenshot columns: Cant. | Producto | Obs | Precio */}
      <div className="flex items-start justify-between gap-1.5">
        {/* Cant. Box */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-slate-50 font-bold text-slate-800">
          {item.quantity}
        </div>

        {/* Producto name & info icon */}
        <div className="flex-1 min-w-0 px-1">
          <div className="flex items-center gap-1 font-bold text-slate-900 leading-tight">
            <span>{item.emoji}</span>
            <span
              onDoubleClick={() => setEditingObs(true)}
              className="truncate cursor-pointer hover:underline"
              title="Doble clic para editar observación"
            >
              {item.name}
            </span>

            {/* Requirement: Show blue info icon if appliesManagerDiscount is true */}
            {item.appliesManagerDiscount !== false && (
              <span
                title="Aplica Descuento Gerencial"
                className="ml-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-xs bg-blue-500 text-[9px] font-bold text-white"
              >
                i
              </span>
            )}
          </div>
        </div>

        {/* Price & Actions: Increment/Decrement & Individual Remove (X) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-bold text-slate-800 text-xs">
            S/ {(item.price * item.quantity).toFixed(2)}
          </span>

          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onIncrement(item.productId)}
              aria-label={`Aumentar cantidad de ${item.name}`}
              className="text-slate-400 hover:text-slate-700"
            >
              <FiChevronUp size={12} />
            </button>
            <button
              type="button"
              onClick={() => onDecrement(item.productId)}
              aria-label={`Disminuir cantidad de ${item.name}`}
              className="text-slate-400 hover:text-slate-700"
            >
              <FiChevronDown size={12} />
            </button>
          </div>

          {/* Requirement: Delete each loaded item button (red X or trash) */}
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            aria-label={`Eliminar ${item.name}`}
            className="flex h-5 w-5 items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
            title="Eliminar producto"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* Options Hierarchy breakdown matching screenshot */}
      {item.options && item.options.length > 0 && (
        <div className="ml-8 mt-1 flex flex-col gap-1 text-[11px] text-slate-600">
          {item.options.map((opt, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-semibold text-slate-700">{opt.category}</span>
              <ul className="ml-2 flex flex-col gap-0.5 text-slate-500">
                {opt.items.map((sub, sIdx) => (
                  <li key={sIdx}>• {sub}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Kitchen Observation (Obs. Cocina) text if set */}
      {item.kitchenObs && !editingObs && (
        <div className="ml-8 mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 self-start">
          <span>Obs: {item.kitchenObs}</span>
          <button
            type="button"
            onClick={() => setEditingObs(true)}
            className="text-amber-800 hover:underline"
          >
            <FiEdit3 size={10} />
          </button>
        </div>
      )}

      {/* Inline edit kitchen obs */}
      {editingObs && (
        <div className="ml-8 mt-1.5 flex items-center gap-1">
          <input
            type="text"
            maxLength={25}
            value={obsInput}
            onChange={(e) => setObsInput(e.target.value)}
            placeholder="Obs. Cocina (máx 25 caract.)"
            className="rounded border border-slate-300 px-2 py-0.5 text-[10px] focus:border-slate-800 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSaveObs}
            className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-white"
          >
            OK
          </button>
        </div>
      )}

      {/* Italic Double-click instruction text from screenshot */}
      <span className="ml-8 mt-0.5 text-[9px] italic text-slate-400">
        Doble clic en nombre para editar
      </span>
    </li>
  );
}
