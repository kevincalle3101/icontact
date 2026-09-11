import type { OrderHistoryItem } from '@/types';

export function getOrderTotal(order: Pick<OrderHistoryItem, 'items'>): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
