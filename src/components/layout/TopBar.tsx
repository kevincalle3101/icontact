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
    <header className="bg-[#0b1021] text-white">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-5 py-2 text-xs font-bold">
        <span className="text-sm tracking-tight text-white font-extrabold">
          TMO: {formatTime(tmoSeconds)}
        </span>

        <div className="flex items-center gap-3">
          <BrandDropdown value={brand} onChange={setBrand} />
          <button
            type="button"
            aria-label="Cuenta de usuario"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FiUser size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages Sub-banner matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border-t border-white/10 bg-[#0f172a] px-5 py-1.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded bg-red-900/40 px-1.5 py-0.5 font-bold uppercase text-red-400 text-[10px]">
            🚩 MENSAJE DE TIENDA
          </span>
          <span className="font-extrabold text-red-500 tracking-wide">{storeMessage}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded bg-blue-900/40 px-1.5 py-0.5 font-bold uppercase text-slate-300 text-[10px]">
            ℹ️ MENSAJE GERENCIAL
          </span>
          <span className="font-extrabold text-red-500 tracking-wide">{managerMessage}</span>
        </div>
      </div>
    </header>
  );
}
