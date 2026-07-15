import { FiEye } from 'react-icons/fi';
import type { OrderHistoryItem } from '@/types';

interface OrderHistoryTableProps {
  orders: OrderHistoryItem[];
  onViewDetails: (order: OrderHistoryItem) => void;
}

export default function OrderHistoryTable({ orders, onViewDetails }: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return <p className="text-xs text-slate-400">Sin pedidos recientes</p>;
  }

  return (
    <table className="w-full text-left text-xs">
      <caption className="sr-only">Últimos pedidos del cliente</caption>
      <thead>
        <tr className="text-slate-400">
          <th scope="col" className="py-1 font-medium">
            Hora
          </th>
          <th scope="col" className="py-1 font-medium">
            Total
          </th>
          <th scope="col" className="py-1 text-right font-medium">
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.slice(0, 2).map((order) => (
          <tr key={order.id} className="border-t border-slate-100">
            <td className="py-1.5 text-slate-600">{order.time}</td>
            <td className="py-1.5 font-semibold text-slate-700">S/ {order.total.toFixed(2)}</td>
            <td className="py-1.5 text-right">
              <button
                type="button"
                onClick={() => onViewDetails(order)}
                aria-label={`Ver detalle del pedido de las ${order.time}`}
                className="text-slate-500 hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy"
              >
                <FiEye aria-hidden="true" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
