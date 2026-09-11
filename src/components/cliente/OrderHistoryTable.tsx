import { getOrderTotal } from '@/utils/orderHistory';
import type { OrderHistoryItem } from '@/types';

interface OrderHistoryTableProps {
  orders: OrderHistoryItem[];
  onViewDetails: (order: OrderHistoryItem) => void;
}

export default function OrderHistoryTable({ orders, onViewDetails }: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return <p className="text-[10px] text-slate-400">Sin pedidos recientes</p>;
  }

  return (
    <table className="w-full text-left text-[11px] border-collapse">
      <caption className="sr-only">Últimos pedidos del cliente</caption>
      <thead>
        <tr className="text-[#a0abba] font-bold text-[10px] border-b border-[#f0f3f8]">
          <th scope="col" className="pb-1 font-bold">
            Hora
          </th>
          <th scope="col" className="pb-1 text-right font-bold pr-1">
            Total
          </th>
          <th scope="col" className="pb-1 text-right w-6 font-bold">
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.slice(0, 2).map((order) => (
          <tr key={order.id} className="border-b border-[#f0f3f8] last:border-b-0">
            <td className="py-1 text-[#475569] font-medium text-[10px]">{order.time}</td>
            <td className="py-1 text-right font-extrabold text-[#1e293b] text-[10px] pr-1">
              S/ {getOrderTotal(order).toFixed(2)}
            </td>
            <td className="py-1 text-right">
              <button
                type="button"
                onClick={() => onViewDetails(order)}
                aria-label={`Ver detalle del pedido de las ${order.time}`}
                className="text-[#64748b] hover:text-[#0b1021] inline-flex items-center justify-center transition-colors"
              >
                👁️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
