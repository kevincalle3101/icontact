import { apiClient } from '@/api/client';
import { MOCK_CUSTOMER, MOCK_ORDER_HISTORY } from '@/data/mockData';
import type { Customer, OrderHistoryItem } from '@/types';

const USE_MOCKS = true;

function simulateDelay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchCustomerByPhone(phone: string): Promise<Customer> {
  if (USE_MOCKS) {
    if (!phone) {
      throw new Error('Número de teléfono requerido');
    }
    return simulateDelay({ ...MOCK_CUSTOMER, phone });
  }
  const { data } = await apiClient.get<Customer>('/customer', { params: { phone } });
  return data;
}

export async function updateCustomer(
  customer: Partial<Customer> & { id: string },
): Promise<Customer> {
  if (USE_MOCKS) {
    return simulateDelay({ ...MOCK_CUSTOMER, ...customer } as Customer);
  }
  const { data } = await apiClient.patch<Customer>('/customer', customer);
  return data;
}

export async function fetchOrderHistory(customerId: string): Promise<OrderHistoryItem[]> {
  if (USE_MOCKS) {
    return simulateDelay(MOCK_ORDER_HISTORY.slice(0, 2), customerId ? 300 : 300);
  }
  const { data } = await apiClient.get<OrderHistoryItem[]>('/orders', {
    params: { customerId },
  });
  return data;
}
