import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import clsx from '@/utils/clsx';

interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  ariaLabel,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const selectedOption = options.find((o) => o.value === value) || null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={clsx(
          'flex w-full items-center justify-between rounded-lg border-[1.5px] border-[#d0d8f0] bg-white px-2.5 py-[9px] text-left text-xs transition-colors focus:border-[#1a1f5e] focus:outline-none',
          disabled && 'cursor-not-allowed bg-[#f5f5f5]',
          !selectedOption && 'text-slate-400',
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <FiChevronDown className="ml-1 shrink-0 text-slate-400" aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-xs text-slate-400">Sin opciones</li>
          ) : (
            options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={clsx(
                    'w-full px-3 py-2 text-left text-xs font-medium hover:bg-slate-100',
                    option.value === value ? 'bg-[#eef2ff] text-[#1a1f5e]' : 'text-slate-700',
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
