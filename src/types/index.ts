export type Brand = 'KFC' | 'Chilis' | 'Madam Tusan' | 'Pizza Hut';

export type DeliveryChannel = 'delivery' | 'pickup';

export interface Customer {
  id: string;
  phone: string;
  refCode?: string;
  firstName: string;
  lastName: string;
  dni: string;
  familyName?: string;
  address: string;
  district: string;
  department: string;
  reference: string;
}

export interface OrderHistoryItem {
  id: string;
  time: string;
  total: number;
}

export type ProductCategory =
  | 'Combos'
  | 'Individuales'
  | 'Complementos'
  | 'Postres'
  | 'Bebidas'
  | 'Salsas'
  | 'Desayunos'
  | 'Otros';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  emoji: string;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  emoji: string;
}

export type PaymentMethod = 'gerencial' | 'soles' | 'usd' | 'tarjeta';

export type InvoiceType = 'boleta' | 'factura';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  exactPayment: boolean;
  invoiceType: InvoiceType;
  dni: string;
  name: string;
  driverObservation: string;
}

export interface StoreInfo {
  code: string;
  name: string;
  address: string;
}

export interface ApiState {
  loading: boolean;
  error: string | null;
}
