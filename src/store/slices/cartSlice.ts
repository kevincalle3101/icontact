import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

const CART_STORAGE_KEY = 'icontact.cart';

const SEEDED_DEFAULT_ITEMS: CartItem[] = [
  {
    productId: 'p-combo-personal',
    name: 'Combo Personal',
    description: '2 piezas de pollo, 1 papa o puré o ensalada regular y 1 bebida personal',
    price: 18.9,
    quantity: 1,
    emoji: '🍗',
    appliesManagerDiscount: true,
    options: [
      { category: '2 pz', items: ['1pz Receta Secreta', '1pz Crispy'] },
      { category: '1 papa', items: ['Papa Personal'] },
      { category: '1 bebida', items: ['Fanta'] },
    ],
  },
  {
    productId: 'p-post-pie-manzana',
    name: 'Pie de Manzana',
    description: 'Postre de manzana horneado',
    price: 7.0,
    quantity: 1,
    emoji: '🥧',
    appliesManagerDiscount: true,
  },
];

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      if (import.meta.env && import.meta.env.MODE === 'test') {
        return [];
      }
      return SEEDED_DEFAULT_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CartItem[];
    return [];
  } catch {
    return [];
  }
}

export function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<Product & { quantity?: number; kitchenObs?: string }>,
    ) {
      const {
        id,
        name,
        description,
        price,
        emoji,
        appliesManagerDiscount,
        options,
        quantity = 1,
        kitchenObs,
      } = action.payload;

      const existing = state.items.find(
        (item) => item.productId === id && item.kitchenObs === kitchenObs,
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          productId: id,
          name,
          description,
          price,
          emoji,
          quantity,
          appliesManagerDiscount,
          options,
          kitchenObs,
        });
      }
      persistCart(state.items);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      persistCart(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      persistCart(state.items);
    },
    updateKitchenObs(
      state,
      action: PayloadAction<{ productId: string; kitchenObs: string }>,
    ) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.kitchenObs = action.payload.kitchenObs;
      }
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      persistCart(state.items);
    },
  },
});

export const { addItem, removeItem, updateQuantity, updateKitchenObs, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
