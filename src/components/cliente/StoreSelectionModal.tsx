import { useEffect, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { MOCK_STORES } from '@/data/mockData';
import type { Brand, Store } from '@/types';

interface StoreSelectionModalProps {
  isOpen: boolean;
  brand: Brand;
  onCancel: () => void;
  onConfirm: (store: Store) => void;
}

function SelectChevron() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default function StoreSelectionModal({
  isOpen,
  brand,
  onCancel,
  onConfirm,
}: StoreSelectionModalProps) {
  const [department, setDepartment] = useState('');
  const [district, setDistrict] = useState('');
  const [storeId, setStoreId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDepartment('');
      setDistrict('');
      setStoreId('');
    }
  }, [isOpen]);

  const brandStores = useMemo(() => MOCK_STORES.filter((s) => s.brand === brand), [brand]);

  const departments = useMemo(
    () => Array.from(new Set(brandStores.map((s) => s.department))),
    [brandStores],
  );

  const districts = useMemo(
    () =>
      Array.from(
        new Set(brandStores.filter((s) => s.department === department).map((s) => s.district)),
      ),
    [brandStores, department],
  );

  const stores = useMemo(
    () =>
      brandStores.filter(
        (s) => s.department === department && (!district || s.district === district),
      ),
    [brandStores, department, district],
  );

  if (!isOpen) return null;

  const selectedStore = stores.find((s) => s.id === storeId) || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#1a1f5e]">Seleccionar Tienda</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Cerrar ventana"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#666666] mb-1">Departamento</label>
            <div className="relative">
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setDistrict('');
                  setStoreId('');
                }}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-2 text-[12px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
              >
                <option value="">Selecciona...</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#666666] mb-1">
              Distrito <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <div className="relative">
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setStoreId('');
                }}
                disabled={!department}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-2 text-[12px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Todos los distritos</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#666666] mb-1">Tienda</label>
            <div className="relative">
              <select
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                disabled={!department}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-2 text-[12px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Selecciona...</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => selectedStore && onConfirm(selectedStore)}
            disabled={!selectedStore}
            className="flex-1 rounded-xl bg-[#1a1f5e] py-2.5 text-[12px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#c7cbe8]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
