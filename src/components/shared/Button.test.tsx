import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/shared/Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Continuar</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not fire onClick when isLoading is true', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Guardar
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Guardar' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('respects the disabled prop', () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole('button', { name: 'Deshabilitado' })).toBeDisabled();
  });
});
