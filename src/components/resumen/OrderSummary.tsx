import Button from '@/components/shared/Button';

interface OrderSummaryProps {
  subtotal: number;
  onClearCart: () => void;
  disabled?: boolean;
}

export default function OrderSummary({ subtotal, onClearCart, disabled }: OrderSummaryProps) {
  const total = subtotal;

  return (
    <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Subtotal:</span>
        <span>S/ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-base font-bold text-slate-800">
        <span>Total:</span>
        <span>S/ {total.toFixed(2)}</span>
      </div>
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={onClearCart}
        disabled={disabled}
        className="self-end"
      >
        Cancelar pedido
      </Button>
    </div>
  );
}
