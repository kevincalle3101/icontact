import { apiClient } from '@/api/client';

const USE_MOCKS = true;

// Mocks a backend that caches the upstream (bank/SUNAT) rate for a few
// minutes so every store nationwide can poll this endpoint cheaply.
const MOCK_RATE = 3.55;

function simulateDelay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchExchangeRate(): Promise<number> {
  if (USE_MOCKS) {
    return simulateDelay(MOCK_RATE);
  }
  const { data } = await apiClient.get<{ rate: number }>('/exchange-rate');
  return data.rate;
}
