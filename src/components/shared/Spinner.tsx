interface SpinnerProps {
  label?: string;
  className?: string;
}

export default function Spinner({ label = 'Cargando...', className }: SpinnerProps) {
  return (
    <div role="status" className={`flex items-center justify-center gap-2 py-6 ${className ?? ''}`}>
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-brand-navy border-t-transparent"
        aria-hidden="true"
      />
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
