import { apiClient } from '@/api/client';
import { MOCK_PRODUCTS, SUGGESTED_PRODUCTS } from '@/data/mockData';
import type { Brand, Product, ProductCategory } from '@/types';

const USE_MOCKS = true;

function simulateDelay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchProductsByCategory(category: ProductCategory): Promise<Product[]> {
  if (USE_MOCKS) {
    return simulateDelay(MOCK_PRODUCTS.filter((p) => p.category === category));
  }
  const { data } = await apiClient.get<Product[]>('/products', { params: { category } });
  return data;
}

export async function fetchProductsByBrand(brand: Brand): Promise<Product[]> {
  if (USE_MOCKS) {
    return simulateDelay(MOCK_PRODUCTS.filter((p) => p.brand === brand));
  }
  const { data } = await apiClient.get<Product[]>('/products', { params: { brand } });
  return data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (USE_MOCKS) {
    const lower = query.trim().toLowerCase();
    if (!lower) return simulateDelay([]);
    return simulateDelay(
      MOCK_PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower),
      ),
    );
  }
  const { data } = await apiClient.get<Product[]>('/products/search', { params: { q: query } });
  return data;
}

export async function fetchSuggestedProducts(): Promise<Product[]> {
  if (USE_MOCKS) {
    return simulateDelay(SUGGESTED_PRODUCTS);
  }
  const { data } = await apiClient.get<Product[]>('/products/suggested');
  return data;
}
