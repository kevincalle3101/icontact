import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import clsx from '@/utils/clsx';
import type { Brand } from '@/types';

const BRANDS: Brand[] = ['KFC', 'Chilis', 'Madam Tusan', 'Pizza Hut'];

interface BrandDropdownProps {
  value: Brand;
  onChange: (brand: Brand) => void;
}

export default function BrandDropdown({ value, onChange }: BrandDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-navy"
          aria-hidden="true"
        >
          {value.slice(0, 1)}
        </span>
        {value}
        <FiChevronDown aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Seleccionar marca"
          className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-slate-200"
        >
          {BRANDS.map((brand) => (
            <li key={brand} role="option" aria-selected={brand === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(brand);
                  setOpen(false);
                }}
                className={clsx(
                  'block w-full px-3 py-2 text-left text-sm hover:bg-slate-100',
                  brand === value ? 'font-semibold text-brand-navy' : 'text-slate-700',
                )}
              >
                {brand}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
