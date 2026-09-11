import { useEffect, useMemo, useState } from 'react';
import CustomSelect from '@/components/shared/CustomSelect';
import { MOCK_STORES } from '@/data/mockData';
import type { Brand, Store } from '@/types';

interface StoreSelectionModalProps {
  isOpen: boolean;
  brand: Brand;
  onCancel: () => void;
  onConfirm: (store: Store) => void;
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
        className="relative w-[360px] rounded-xl bg-white px-3.5 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-[18px] flex items-center justify-between">
          <span className="text-sm font-bold text-[#1a1f5e]">Seleccionar Tienda</span>
          <button
            type="button"
            onClick={onCancel}
            className="border-none bg-transparent text-lg text-[#999999] cursor-pointer"
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <label className="mb-[5px] block text-[11px] font-semibold text-[#666666]">
            Departamento
          </label>
          <CustomSelect
            ariaLabel="Departamento"
            value={department}
            onChange={(v) => {
              setDepartment(v);
              setDistrict('');
              setStoreId('');
            }}
            options={departments.map((d) => ({ value: d, label: d }))}
            placeholder="Selecciona..."
          />
        </div>

        <div className="mb-3">
          <label className="mb-[5px] block text-[11px] font-semibold text-[#666666]">
            Distrito <span className="font-normal text-[#aaaaaa]">(opcional)</span>
          </label>
          <CustomSelect
            ariaLabel="Distrito"
            value={district}
            onChange={(v) => {
              setDistrict(v);
              setStoreId('');
            }}
            options={districts.map((d) => ({ value: d, label: d }))}
            placeholder="Todos los distritos"
            disabled={!department}
          />
        </div>

        <div className="mb-3">
          <label className="mb-[5px] block text-[11px] font-semibold text-[#666666]">Tienda</label>
          <CustomSelect
            ariaLabel="Tienda"
            value={storeId}
            onChange={setStoreId}
            options={stores.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` }))}
            placeholder="Selecciona..."
            disabled={!department}
          />
        </div>

        <div className="mt-[18px] flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border-[1.5px] border-[#d0d0d0] bg-white p-2.5 text-xs font-semibold text-black transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => selectedStore && onConfirm(selectedStore)}
            disabled={!selectedStore}
            className="flex-1 rounded-lg bg-[#1a1f5e] p-2.5 text-xs font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-[#c0c8e0]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
