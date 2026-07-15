import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';

const product: Product = {
  id: 'p-1',
  name: 'Combo Personal',
  description: '2 piezas de pollo, 1 papa y 1 bebida personal',
  price: 18.9,
  category: 'Combos',
  emoji: '🍗',
};

describe('ProductCard', () => {
  it('renders product name, description and price', () => {
    render(<ProductCard product={product} onAdd={vi.fn()} />);
    expect(screen.getByText('Combo Personal')).toBeInTheDocument();
    expect(screen.getByText(/2 piezas de pollo/)).toBeInTheDocument();
    expect(screen.getByText('S/ 18.90')).toBeInTheDocument();
  });

  it('calls onAdd with the product when the add button is clicked', async () => {
    const onAdd = vi.fn();
    render(<ProductCard product={product} onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: /Agregar Combo Personal/i }));
    expect(onAdd).toHaveBeenCalledWith(product);
  });
});
