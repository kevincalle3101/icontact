import { useState } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import type { CartItem } from '@/types';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onUpdateKitchenObs?: (productId: string, obs: string) => void;
}

const ROW_GRID_COLUMNS = '46px 1fr 56px 46px';

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  onUpdateKitchenObs,
}: CartItemRowProps) {
  const [editingObs, setEditingObs] = useState(false);
  const [obsInput, setObsInput] = useState(item.kitchenObs || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSaveObs = () => {
    if (onUpdateKitchenObs) {
      onUpdateKitchenObs(item.productId, obsInput.trim());
    }
    setEditingObs(false);
  };

  return (
    <li className="mb-[6px] border-b border-[#f5f6fa] pb-[6px] text-[10px] last:mb-0 last:border-b-0 last:pb-0">
      {/* Top Main Row matching columns: Cant. | Producto | Obs | Precio */}
      <div className="grid items-center gap-[3px]" style={{ gridTemplateColumns: ROW_GRID_COLUMNS }}>
        {/* Cant. - editable */}
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onQuantityChange(item.productId, Math.max(1, Number(e.target.value) || 1))}
          aria-label={`Cantidad de ${item.name}`}
          className="w-[42px] rounded-[6px] border-[1.5px] border-[#d0d8f0] bg-[#fafbff] px-[4px] py-[3px] text-center text-[11px] font-bold text-slate-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />

        {/* Producto name */}
        <div className="flex items-center gap-1 min-w-0 font-bold leading-[1.3] text-[#1a1f5e]">
          <span>{item.emoji}</span>
          <span
            onDoubleClick={() => setEditingObs(true)}
            className="truncate cursor-pointer hover:underline"
            title="Doble clic para editar"
          >
            {item.name}
          </span>
        </div>

        {/* Obs. column - manager discount indicator */}
        <div className="text-center">
          {item.appliesManagerDiscount && (
            <span
              role="img"
              title="Desc. gerencial"
              aria-label="Información de descuento"
              className="text-[9px] text-[#1a3ff5]"
            >
              ℹ️
            </span>
          )}
        </div>

        {/* Precio, toggle description & remove */}
        <div className="flex items-center justify-end gap-[1px] text-[10px] font-bold text-[#333333]">
          <span>{(item.price * item.quantity).toFixed(2)}</span>

          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            aria-label={isExpanded ? `Ocultar detalle de ${item.name}` : `Ver detalle de ${item.name}`}
            className="px-[1px] text-[8px] text-[#aaaaaa]"
          >
            {isExpanded ? '▲' : '▼'}
          </button>

          {/* Requirement: Delete each loaded item button */}
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            aria-label={`Eliminar ${item.name}`}
            title="Eliminar"
            className="ml-[2px] px-[1px] text-[11px] text-[#c0392b]"
          >
            ×
          </button>
        </div>
      </div>

      {/* Inline edit kitchen obs - reachable via double-click regardless of expand state */}
      {editingObs && (
        <div className="mt-1.5 flex items-center gap-1" style={{ paddingLeft: '49px' }}>
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
        <div className="mt-1" style={{ paddingLeft: '49px' }}>
          {/* Options Hierarchy breakdown */}
          {item.options && item.options.length > 0 && (
            <div className="flex flex-col gap-[3px]">
              {item.options.map((opt, idx) => (
                <div key={idx}>
                  <div className="text-[9px] font-bold text-[#666666]">{opt.category}</div>
                  <ul className="pl-[6px]">
                    {opt.items.map((sub, sIdx) => (
                      <li key={sIdx} className="text-[9px] text-[#888888]">
                        • {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Kitchen Observation (Obs. Cocina) text if set */}
          {item.kitchenObs && !editingObs && (
            <div className="mt-1 flex items-center gap-1 self-start rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
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

          <div className="mt-[2px] text-[8px] italic text-[#8892b0]">
            Doble clic en nombre para editar
          </div>
        </div>
      )}
    </li>
  );
}
