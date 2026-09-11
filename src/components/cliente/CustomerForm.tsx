import { useState } from 'react';
import { FiPhone, FiSearch, FiUser, FiMapPin, FiChevronDown } from 'react-icons/fi';
import type { Customer } from '@/types';

interface CustomerFormProps {
  customer: Customer | null;
  loading: boolean;
  onSearch: (phone: string) => void;
  onSave: (customerData: Partial<Customer> & { id: string }) => void;
  onOpenEditModal: () => void;
}

export default function CustomerForm({
  customer,
  loading,
  onSearch,
  onSave,
}: CustomerFormProps) {
  const [phoneInput, setPhoneInput] = useState(customer?.phone || '970220065');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(phoneInput);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-xs">
      {/* Phone input row */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <FiPhone
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
            size={14}
          />
          <input
            type="tel"
            aria-label="Número de teléfono"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            onKeyDown={handlePhoneKeyDown}
            className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-16 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-none bg-white"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-[#0f172a] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
            AUDAZ
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSearch(phoneInput)}
          disabled={loading}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          title="Buscar teléfono"
        >
          <FiSearch size={14} />
        </button>
      </div>

      {/* TLF REF requirement: "Renombrar el campo REF por TLF REF" */}
      <div className="text-[11px] text-slate-500">
        <span className="font-semibold text-slate-600">TLF REF:</span>{' '}
        <span>{customer?.refCode || '996097394'}</span>
      </div>

      {/* Customer Name Dropdown line */}
      <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-800">
        <div className="flex items-center gap-1.5 truncate">
          <FiUser className="text-slate-500 shrink-0" size={14} />
          <span className="truncate">
            {customer
              ? `${customer.firstName} ${customer.lastName}`
              : 'Rosa Stefania Gerónimo Llanos'}
          </span>
        </div>
        <FiChevronDown className="text-slate-400 shrink-0 ml-1" />
      </div>

      {/* DNI & Familia details */}
      <div className="text-[11px] text-slate-600">
        <p>
          <span className="font-semibold">DNI:</span> {customer?.dni || '72749143'}
        </p>
        <p>
          <span className="font-semibold">Familia:</span>{' '}
          {customer?.familyName || customer?.lastName || 'Gerónimo Llanos'}
        </p>
      </div>

      {/* DIRECCIÓN DE ENTREGA Subheader */}
      <div className="mt-1 border-t border-slate-200 pt-2">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Dirección de entrega
        </h3>

        {/* Address selector dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddressDropdown((v) => !v)}
            className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-800 text-left"
          >
            <div className="flex items-center gap-1.5 truncate">
              <FiMapPin className="text-red-500 shrink-0" size={14} />
              <span className="truncate">
                {customer
                  ? `${customer.address} ${customer.number || ''}`.trim()
                  : 'Avenida Javier Prado Oeste 1650'}
              </span>
            </div>
            <FiChevronDown className="text-slate-400 shrink-0 ml-1" />
          </button>

          {showAddressDropdown && customer?.addresses && customer.addresses.length > 0 && (
            <ul className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg text-xs">
              {customer.addresses.map((addr) => (
                <li key={addr.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSave({
                        id: customer.id,
                        address: addr.address,
                        number: addr.number,
                        district: addr.district,
                        department: addr.department,
                        reference: addr.reference,
                      });
                      setShowAddressDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-100 font-medium text-slate-700"
                  >
                    📍 {addr.address} {addr.number} ({addr.district})
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Address details */}
        <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] text-slate-600">
          <p>
            <span className="font-semibold">Distrito:</span> {customer?.district || 'San Isidro'}
          </p>
          <p>
            <span className="font-semibold">Departamento:</span> {customer?.department || 'Block C'}
          </p>
          <p className="truncate">
            <span className="font-semibold">Ref.:</span> {customer?.reference || 'CRC AV LAS FLORES'}
          </p>
        </div>
      </div>
    </div>
  );
}
