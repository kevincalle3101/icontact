import { beforeEach, describe, expect, it } from 'vitest';
import cartReducer, {
  addItem,
  clearCart,
  removeItem,
  updateQuantity,
} from '@/store/slices/cartSlice';
import type { Product } from '@/types';

beforeEach(() => {
  localStorage.clear();
});

const product: Product = {
  id: 'p-1',
  brand: 'KFC',
  name: 'Combo Personal',
  description: '2 piezas de pollo',
  price: 18.9,
  category: 'Combos',
  emoji: '🍗',
};

describe('cartSlice', () => {
  it('returns the initial empty state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({ items: [] });
  });

  it('adds a new item to the cart', () => {
    const state = cartReducer({ items: [] }, addItem(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ productId: 'p-1', quantity: 1 });
  });

  it('increments quantity when adding an existing item', () => {
    let state = cartReducer({ items: [] }, addItem(product));
    state = cartReducer(state, addItem(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('updates quantity for an existing item', () => {
    let state = cartReducer({ items: [] }, addItem(product));
    state = cartReducer(state, updateQuantity({ productId: 'p-1', quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('removes item when quantity is set to 0 or less', () => {
    let state = cartReducer({ items: [] }, addItem(product));
    state = cartReducer(state, updateQuantity({ productId: 'p-1', quantity: 0 }));
    expect(state.items).toHaveLength(0);
  });

  it('removes an item explicitly', () => {
    let state = cartReducer({ items: [] }, addItem(product));
    state = cartReducer(state, removeItem('p-1'));
    expect(state.items).toHaveLength(0);
  });

  it('clears the cart', () => {
    let state = cartReducer({ items: [] }, addItem(product));
    state = cartReducer(state, clearCart());
    expect(state.items).toEqual([]);
  });

  it('persists cart items to localStorage', () => {
    cartReducer({ items: [] }, addItem(product));
    const stored = localStorage.getItem('icontact.cart');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)).toHaveLength(1);
  });
});
