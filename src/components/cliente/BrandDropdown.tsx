import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import clsx from '@/utils/clsx';
import type { Brand } from '@/types';

const BRANDS: Brand[] = ['KFC', 'Chilis', 'Madam Tusan', 'Pizza Hut'];

const BRAND_IMAGES: Record<Brand, string> = {
  KFC: '/brands/kfc.svg',
  Chilis: '/brands/chilis.svg',
  'Madam Tusan': '/brands/madam-tusan.svg',
  'Pizza Hut': '/brands/pizza-hut.svg',
};

interface BrandDropdownProps {
  value: Brand;
  onChange: (brand: Brand) => void;
}

export default function BrandDropdown({ value, onChange }: BrandDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-white">Marca:</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <img
            src={BRAND_IMAGES[value]}
            alt={value}
            className="h-6 w-6 rounded-full"
            aria-hidden="true"
          />
          {value}
          <FiChevronDown aria-hidden="true" />
        </button>
      </div>
      {open && (
        <ul
          role="listbox"
          aria-label="Seleccionar marca"
          className="absolute right-0 z-10 mt-1 w-48 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-slate-200"
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
                  'flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-slate-100',
                  brand === value ? 'font-semibold text-brand-navy' : 'text-slate-700',
                )}
              >
                <img
                  src={BRAND_IMAGES[brand]}
                  alt={brand}
                  className="h-5 w-5 rounded-full"
                  aria-hidden="true"
                />
                {brand}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
