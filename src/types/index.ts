export type Brand = 'KFC' | 'Chilis' | 'Madam Tusan' | 'Pizza Hut';

export type DeliveryChannel = 'delivery' | 'pickup';

export interface AddressItem {
  id: string;
  address: string;
  number: string; // Nro/Mz
  district: string;
  department: string; // Dpto/Interior
  reference: string;
}

export interface RelatedClient {
  id: string;
  firstName: string;
  lastName: string;
  dni: string;
}

export interface Customer {
  id: string;
  phone: string;
  refCode?: string; // TLF REF
  firstName: string;
  lastName: string;
  dni: string;
  familyName?: string;
  address: string;
  number?: string; // Nro/Mz
  district: string;
  department: string;
  reference: string;
  addresses?: AddressItem[];
  relatedClients?: RelatedClient[];
}

export interface OrderItemOption {
  label: string;
  note?: string;
}

export interface OrderOptionGroup {
  category: string;
  items: OrderItemOption[];
}

export interface OrderLineItem {
  name: string;
  quantity: number;
  price: number;
  emoji?: string;
  optionGroups?: OrderOptionGroup[];
}

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string; // dd/mm/yyyy
  time: string;
  total: number;
  items: OrderLineItem[];
}

export type ProductCategory =
  // KFC
  | 'Combos'
  | 'Individuales'
  | 'Complementos'
  | 'Postres'
  | 'Bebidas'
  | 'Salsas'
  | 'Desayunos'
  | 'Otros'
  // Chili's
  | 'Entradas'
  | 'Parrillas'
  | 'Fajitas'
  | 'Hamburguesas'
  | 'Ensaladas'
  // Madam Tusan
  | 'Dim Sum'
  | 'Wok'
  | 'Arroz Chaufa'
  | 'Sopas'
  // Pizza Hut
  | 'Pizzas'
  | 'Pastas'
  | 'Alitas';

export interface ProductOption {
  category: string;
  items: string[];
}

export interface Product {
  id: string;
  brand: Brand;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  emoji: string;
  imageUrl?: string;
  appliesManagerDiscount?: boolean;
  options?: ProductOption[];
}

export interface CartItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  emoji: string;
  appliesManagerDiscount?: boolean;
  kitchenObs?: string; // Obs. Cocina (max 16-25 chars)
  options?: ProductOption[];
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
  bonusDni?: string;
  driverObservation: string;
  managerDiscountApplied?: boolean;
}

export interface StoreInfo {
  code: string;
  name: string;
  address: string;
}

export interface Store {
  id: string;
  code: string;
  name: string;
  brand: Brand;
  department: string;
  district: string;
  address: string;
}

export interface ApiState {
  loading: boolean;
  error: string | null;
}
