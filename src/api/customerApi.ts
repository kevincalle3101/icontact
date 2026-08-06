import { apiClient } from '@/api/client';
import { MOCK_CUSTOMER, MOCK_ORDER_HISTORY, MOCK_STORE_INFO } from '@/data/mockData';
import type { Customer, OrderHistoryItem, StoreInfo } from '@/types';

const USE_MOCKS = true;

// In-memory store for updated customers during session
const customerCache: Record<string, Customer> = {};

function simulateDelay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchCustomerByPhone(phone: string): Promise<{
  customer: Customer;
  orderHistory: OrderHistoryItem[];
  storeInfo: StoreInfo;
}> {
  if (USE_MOCKS) {
    if (!phone) {
      throw new Error('Número de teléfono requerido');
    }

    let customer: Customer;
    if (customerCache[phone]) {
      customer = customerCache[phone];
    } else {
      // Return custom data per phone
      if (phone === '970220065') {
        customer = { ...MOCK_CUSTOMER, phone: '970220065' };
      } else {
        customer = {
          ...MOCK_CUSTOMER,
          id: `cust-${phone}`,
          phone,
          refCode: `9${phone.slice(1)}`,
          firstName: 'Cliente',
          lastName: `Tel ${phone.slice(-4)}`,
          dni: `${Math.floor(10000000 + Math.random() * 90000000)}`,
          familyName: `Tel ${phone.slice(-4)}`,
          address: 'Av. Arequipa',
          number: '1200',
          district: 'Lima',
          department: 'Piso 4',
          reference: 'Frente al parque',
        };
      }
      customerCache[phone] = customer;
    }

    // Dynamic order history per phone
    const lastDigits = parseInt(phone.slice(-2) || '0', 10);
    const orderHistory: OrderHistoryItem[] = [
      { id: `ord-${phone}-1`, time: '14:51', total: 35.4 + (lastDigits % 15) },
      { id: `ord-${phone}-2`, time: '10:20', total: 18.9 + (lastDigits % 10) },
    ];

    // Dynamic store info per phone/district
    const storeInfo: StoreInfo =
      customer.district.includes('Miraflores')
        ? { code: 'KF012', name: 'MIRAFLORES', address: 'Av. Larco 450, Miraflores' }
        : customer.district.includes('Lima')
          ? { code: 'KF001', name: 'CENTRO LIMA', address: 'Jr. de la Unión 500, Lima' }
          : MOCK_STORE_INFO;

    return simulateDelay({ customer, orderHistory, storeInfo });
  }

  const { data } = await apiClient.get<{
    customer: Customer;
    orderHistory: OrderHistoryItem[];
    storeInfo: StoreInfo;
  }>('/customer', { params: { phone } });
  return data;
}

export async function updateCustomer(
  customer: Partial<Customer> & { id: string },
): Promise<Customer> {
  if (USE_MOCKS) {
    const phone = customer.phone || '970220065';
    const existing = customerCache[phone] || { ...MOCK_CUSTOMER, phone };
    const updated: Customer = {
      ...existing,
      ...customer,
    };
    customerCache[phone] = updated;
    return simulateDelay(updated);
  }
  const { data } = await apiClient.patch<Customer>('/customer', customer);
  return data;
}

export async function fetchOrderHistory(customerId: string): Promise<OrderHistoryItem[]> {
  if (USE_MOCKS) {
    return simulateDelay(MOCK_ORDER_HISTORY.slice(0, 2), customerId ? 200 : 200);
  }
  const { data } = await apiClient.get<OrderHistoryItem[]>('/orders', {
    params: { customerId },
  });
  return data;
}
