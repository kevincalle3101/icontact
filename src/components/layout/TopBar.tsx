import { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { tickTmo } from '@/store/slices/uiSlice';
import BrandDropdown from '@/components/cliente/BrandDropdown';
import type { Brand } from '@/types';

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export default function TopBar() {
  const dispatch = useAppDispatch();
  const { storeMessage, managerMessage, tmoSeconds } = useAppSelector((state) => state.ui);
  const [brand, setBrand] = useState<Brand>('KFC');

  useEffect(() => {
    const interval = setInterval(() => dispatch(tickTmo()), 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <header className="bg-brand-navy text-white">
      <div className="flex items-center justify-between px-4 py-2 text-sm font-bold">
        <span>TMO: {formatTime(tmoSeconds)}</span>
        <div className="flex items-center gap-3">
          <BrandDropdown value={brand} onChange={setBrand} />
          <button
            type="button"
            aria-label="Cuenta de usuario"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <FiUser aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 bg-white/5 px-4 py-1.5 text-xs">
        <p>
          <span className="font-bold text-red-400">🚩 MENSAJE DE TIENDA</span>{' '}
          <span className="text-red-300">{storeMessage}</span>
        </p>
        <p>
          <span className="font-bold text-blue-300">ℹ️ MENSAJE GERENCIAL</span>{' '}
          <span className="text-blue-200">{managerMessage}</span>
        </p>
      </div>
    </header>
  );
}
