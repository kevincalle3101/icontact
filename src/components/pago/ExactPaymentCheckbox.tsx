interface ExactPaymentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ExactPaymentCheckbox({ checked, onChange }: ExactPaymentCheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-[10px] text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3 w-3 rounded border-slate-300 text-[10px] focus:ring-brand-navy"
      />
      Pago Exacto
    </label>
  );
}
