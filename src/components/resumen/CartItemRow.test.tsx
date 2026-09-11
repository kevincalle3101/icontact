import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
        <CartItemRow item={item} onQuantityChange={vi.fn()} onRemove={vi.fn()} />
      </ul>,
    );
    expect(screen.getByText('Combo Personal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByText('37.80')).toBeInTheDocument();
  });

  it('calls onQuantityChange / onRemove handlers', async () => {
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    render(
      <ul>
        <CartItemRow item={item} onQuantityChange={onQuantityChange} onRemove={onRemove} />
      </ul>,
    );

    const quantityInput = screen.getByRole('spinbutton', { name: /Cantidad de Combo Personal/i });
    fireEvent.change(quantityInput, { target: { value: '3' } });
    expect(onQuantityChange).toHaveBeenCalledWith('p-1', 3);

    await userEvent.click(screen.getByRole('button', { name: /Eliminar Combo Personal/i }));
    expect(onRemove).toHaveBeenCalledWith('p-1');
  });

  it('toggles the product option breakdown', async () => {
    const itemWithOptions: CartItem = {
      ...item,
      options: [{ category: '2 pz', items: ['1pz Receta Secreta', '1pz Crispy'] }],
    };
    render(
      <ul>
        <CartItemRow item={itemWithOptions} onQuantityChange={vi.fn()} onRemove={vi.fn()} />
      </ul>,
    );

    expect(screen.queryByText('1pz Receta Secreta', { exact: false })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Ver detalle de Combo Personal/i }));
    expect(screen.getByText('• 1pz Receta Secreta')).toBeInTheDocument();
  });
});
