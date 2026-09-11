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
    <div className="flex flex-col">
      <div className="flex justify-end gap-2 pt-1 text-[12px] font-extrabold text-[#1a1f5e]">
        <span>Subtotal:</span>
        <span>S/ {subtotal.toFixed(2)}</span>
      </div>
      <div className="mt-1 flex justify-end gap-2 border-t border-[#eef0f8] pt-0.5 text-[13px] font-extrabold text-[#1a1f5e]">
        <span>Total:</span>
        <span>S/ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
