import { useState } from 'react';
import { FiX, FiChevronUp, FiChevronDown, FiEdit3, FiInfo } from 'react-icons/fi';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onUpdateKitchenObs?: (productId: string, obs: string) => void;
}

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  onUpdateKitchenObs,
}: CartItemRowProps) {
  const [editingObs, setEditingObs] = useState(false);
  const [obsInput, setObsInput] = useState(item.kitchenObs || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = (item.options && item.options.length > 0) || !!item.kitchenObs;

  const handleSaveObs = () => {
    if (onUpdateKitchenObs) {
      onUpdateKitchenObs(item.productId, obsInput.trim());
    }
    setEditingObs(false);
  };

  return (
    <li className="flex flex-col border-b border-slate-200 py-2 text-[10px] last:border-b-0">
      {/* Top Main Row matching columns: Cant. | Producto | Obs | Precio */}
      <div className="flex items-center gap-1.5">
        {/* Cant. - editable */}
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.productId, Math.max(1, Number(e.target.value) || 1))}
          aria-label={`Cantidad de ${item.name}`}
          className="h-7 w-8 shrink-0 rounded-md border border-slate-300 bg-white text-center font-bold text-slate-800 focus:border-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {/* Producto name */}
        <div className="flex items-center gap-1 flex-1 min-w-0 px-1 font-bold text-[#1a1f5e]">
          <span>{item.emoji}</span>
          <span
            onDoubleClick={() => setEditingObs(true)}
            className="truncate cursor-pointer hover:underline"
            title="Doble clic para editar observación"
          >
            {item.name}
          </span>
        </div>

        {/* Obs. column - manager discount badge */}
        <div className="flex w-6 shrink-0 justify-center">
          {item.appliesManagerDiscount && (
            <span
              className="flex h-4 w-4 items-center justify-center rounded bg-blue-400 text-white"
              role="img"
              title="Sí aplica para descuento gerencial"
              aria-label="Información de descuento"
            >
              <FiInfo size={10} />
            </span>
          )}
        </div>

        {/* Precio, toggle description & remove */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="font-bold text-slate-800">
            {(item.price * item.quantity).toFixed(2)}
          </span>

          {hasDetails && (
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              aria-label={isExpanded ? `Ocultar detalle de ${item.name}` : `Ver detalle de ${item.name}`}
              className="text-slate-400 hover:text-slate-700"
            >
              {isExpanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
            </button>
          )}

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

      {/* Inline edit kitchen obs - reachable via double-click regardless of expand state */}
      {editingObs && (
        <div className="ml-9 mt-1.5 flex items-center gap-1">
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

      {isExpanded && (
        <>
          {/* Options Hierarchy breakdown */}
          {item.options && item.options.length > 0 && (
            <div className="ml-9 mt-1 flex flex-col gap-1 text-[10px] text-slate-600">
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
            <div className="ml-9 mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 self-start">
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

          <span className="ml-9 mt-0.5 text-[9px] italic text-slate-400">
            Doble clic en nombre para editar
          </span>
        </>
      )}
    </li>
  );
}
