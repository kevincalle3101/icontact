interface AmountInputProps {
  value: number;
  total: number;
  currencySymbol?: string;
  exchangeRate?: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  showDiffBox?: boolean;
}

export default function AmountInput({
  value,
  total,
  currencySymbol = 'S/',
  exchangeRate,
  onChange,
  disabled,
  showDiffBox = true,
}: AmountInputProps) {
  const diff = value - total;
  const isEmpty = value === 0;
  const textColorClass = diff < 0 ? 'text-red-600' : diff > 0 ? 'text-[#1a1f5e]' : 'text-green-600';
  const boxClass = isEmpty
    ? 'rounded-[7px] border-[1.5px] border-[#b8d4f8] bg-[#f0f7ff] px-[10px] py-[6px]'
    : `rounded-lg border px-3 py-2 border-blue-200 bg-blue-50 ${textColorClass}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="payment-amount" className="block text-[10px] font-semibold text-slate-700">
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
        className="w-full rounded-lg border border-slate-300 px-[10px] py-[6px] text-[13px] font-semibold text-slate-800 focus:border-slate-800 focus:outline-none bg-white"
      />

      {currencySymbol === '$' && exchangeRate != null && (
        <div className="text-[10px] text-slate-500">Tipo de cambio: {exchangeRate.toFixed(2)}</div>
      )}

      {/* Display box below showing 'Falta (S/): S/ XX.XX' or 'Vuelto (S/): S/ XX.XX' or '✓ Monto exacto' */}
      {showDiffBox && (
        <div className={`flex flex-col justify-center gap-0.5 ${boxClass}`}>
          {isEmpty ? (
            <span className="text-[10px] text-[#999999]">—</span>
          ) : diff < 0 ? (
            <>
              <span className="text-[10px] font-bold">Falta ({currencySymbol}):</span>
              <span className="text-[13px] font-bold">
                {currencySymbol} {Math.abs(diff).toFixed(2)}
              </span>
            </>
          ) : diff > 0 ? (
            <>
              <span className="text-[10px] font-bold">Vuelto ({currencySymbol}):</span>
              <span className="text-[13px] font-bold">
                {currencySymbol} {diff.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-[10px] font-bold text-[#1a7f37]">✓ Monto exacto</span>
          )}
        </div>
      )}
    </div>
  );
}
