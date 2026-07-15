import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItemRow from '@/components/resumen/CartItemRow';
import type { CartItem } from '@/types';

const item: CartItem = {
  productId: 'p-1',
  name: 'Combo Personal',
  description: '2 piezas de pollo',
  price: 18.9,
  quantity: 2,
  emoji: '🍗',
};

describe('CartItemRow', () => {
  it('renders item name, quantity and computed line total', () => {
    render(
      <ul>
        <CartItemRow item={item} onIncrement={vi.fn()} onDecrement={vi.fn()} onRemove={vi.fn()} />
      </ul>,
    );
    expect(screen.getByText('Combo Personal')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('S/ 37.80')).toBeInTheDocument();
  });

  it('calls onIncrement / onDecrement / onRemove handlers', async () => {
    const onIncrement = vi.fn();
    const onDecrement = vi.fn();
    const onRemove = vi.fn();
    render(
      <ul>
        <CartItemRow
          item={item}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
        />
      </ul>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Aumentar cantidad/i }));
    expect(onIncrement).toHaveBeenCalledWith('p-1');

    await userEvent.click(screen.getByRole('button', { name: /Disminuir cantidad/i }));
    expect(onDecrement).toHaveBeenCalledWith('p-1');

    await userEvent.click(screen.getByRole('button', { name: /Eliminar Combo Personal/i }));
    expect(onRemove).toHaveBeenCalledWith('p-1');
  });
});
