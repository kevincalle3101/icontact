interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  changeAmount?: number;
}

export default function AmountInput({ value, onChange, disabled, changeAmount }: AmountInputProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="payment-amount" className="mb-1 block text-xs font-medium text-slate-600">
          Monto
        </label>
        <input
          id="payment-amount"
          type="number"
          min="0"
          step="0.10"
          inputMode="decimal"
          placeholder="0.00"
          disabled={disabled}
          value={Number.isNaN(value) ? '' : value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
        />
      </div>
      <div>
        <span className="mb-1 block text-xs font-medium text-slate-600">Vuelto (S/):</span>
        <div className="flex h-[38px] items-center rounded-md bg-slate-100 px-3 text-sm text-slate-500">
          {changeAmount !== undefined && changeAmount >= 0 ? changeAmount.toFixed(2) : '—'}
        </div>
      </div>
    </div>
  );
}
