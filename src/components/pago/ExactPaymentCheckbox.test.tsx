import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExactPaymentCheckbox from '@/components/pago/ExactPaymentCheckbox';

describe('ExactPaymentCheckbox', () => {
  it('renders unchecked by default', () => {
    render(<ExactPaymentCheckbox checked={false} onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox', { name: 'Pago Exacto' })).not.toBeChecked();
  });

  it('calls onChange with true when toggled on', async () => {
    const onChange = vi.fn();
    render(<ExactPaymentCheckbox checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Pago Exacto' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
