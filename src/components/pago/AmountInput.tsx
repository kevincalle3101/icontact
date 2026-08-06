interface AmountInputProps {
  value: number;
  total: number;
  currencySymbol?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function AmountInput({
  value,
  total,
  currencySymbol = 'S/',
  onChange,
  disabled,
}: AmountInputProps) {
  const diff = value - total;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="payment-amount" className="block text-xs font-semibold text-slate-700">
        Monto:
      </label>
      <input
        id="payment-amount"
        type="number"
        min="0"
        step="0.10"
        inputMode="decimal"
        placeholder="0.00"
        disabled={disabled}
        value={Number.isNaN(value) || value === 0 ? '' : value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-slate-800 focus:outline-none bg-white"
      />

      {/* Display box below showing 'Falta: S/ XX.XX' or 'Cambio: S/ XX.XX' or '—' */}
      <div
        className={`flex h-8 items-center rounded-lg border px-3 text-xs font-semibold ${
          value > 0 && diff < 0
            ? 'border-red-300 bg-red-50 text-red-700'
            : diff > 0
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}
      >
        {value === 0 ? (
          '—'
        ) : diff < 0 ? (
          <span>
            Falta: {currencySymbol} {Math.abs(diff).toFixed(2)}
          </span>
        ) : diff > 0 ? (
          <span>
            Vuelto: {currencySymbol} {diff.toFixed(2)}
          </span>
        ) : (
          <span>Monto Exacto</span>
        )}
      </div>
    </div>
  );
}
