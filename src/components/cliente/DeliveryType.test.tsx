import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeliveryType from '@/components/cliente/DeliveryType';

describe('DeliveryType', () => {
  it('marks the active channel as checked', () => {
    render(<DeliveryType value="delivery" onChange={vi.fn()} />);
    expect(screen.getByRole('radio', { name: 'Delivery' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Pickup' })).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange with the selected channel', async () => {
    const onChange = vi.fn();
    render(<DeliveryType value="delivery" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Pickup' }));
    expect(onChange).toHaveBeenCalledWith('pickup');
  });
});
