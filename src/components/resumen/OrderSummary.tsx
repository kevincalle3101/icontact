interface OrderSummaryProps {
  subtotal: number;
  total?: number;
  onClearCart: () => void;
  disabled?: boolean;
}

export default function OrderSummary({
  subtotal,
  total = subtotal,
}: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-1 border-t border-slate-200 pt-2 font-semibold">
      <div className="flex items-center justify-end gap-3 text-xs text-slate-600">
        <span>Subtotal:</span>
        <span className="w-20 text-right">S/ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-end gap-3 text-sm font-bold text-slate-900">
        <span>Total:</span>
        <span className="w-20 text-right">S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
