import { FiX } from 'react-icons/fi';
import type { OrderHistoryItem } from '@/types';

interface OrderDetailModalProps {
  order: OrderHistoryItem | null;
  onClose: () => void;
  onLoadOrder: (order: OrderHistoryItem) => void;
}

export default function OrderDetailModal({ order, onClose, onLoadOrder }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative flex w-full max-w-[440px] max-h-[85vh] flex-col overflow-hidden rounded-xl bg-white p-3.5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3.5 flex items-center justify-between">
          <div>
            <div className="text-[14px] font-bold text-[#1a1f5e]">Pedido #{order.orderNumber}</div>
            <div className="text-[11px] text-[#888888]">
              {order.date} – {order.time}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#999999] hover:text-slate-600 transition-colors"
            aria-label="Cerrar ventana"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="mb-3.5 flex-1 overflow-y-auto">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="mb-2.5 border-b border-[#f5f5f5] pb-2.5 last:mb-0 last:border-b-0 last:pb-0"
            >
              <div className="mb-1 flex justify-between text-[12px] font-bold text-[#1a1f5e]">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
              </div>

              {item.optionGroups?.map((group, gIdx) => (
                <div key={gIdx} className="mb-0.5 pl-2.5">
                  <div className="text-[10px] font-bold text-[#666666]">{group.category}</div>
                  {group.items.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="flex gap-2 pl-2 text-[10px] text-[#888888]"
                    >
                      <span>• {opt.label}</span>
                      {opt.note && <span className="text-[#e01020]">— {opt.note}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-3">
          <span className="text-[13px] font-bold">Total: S/ {order.total.toFixed(2)}</span>
          <button
            type="button"
            onClick={() => onLoadOrder(order)}
            className="rounded-lg bg-[#1a1f5e] px-4.5 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-[#252b73]"
          >
            Cargar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
