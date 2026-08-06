import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar en esta categoría...',
}: SearchBarProps) {
  return (
    <div className="relative">
      <FiSearch
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={14}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar productos"
        className="w-full rounded-xl border border-slate-300 py-1.5 pl-8 pr-3 text-xs focus:border-[#0b1021] focus:outline-none bg-slate-50/50"
      />
    </div>
  );
}
