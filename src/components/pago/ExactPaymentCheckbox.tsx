interface ExactPaymentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ExactPaymentCheckbox({ checked, onChange }: ExactPaymentCheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
      />
      Pago Exacto
    </label>
  );
}
