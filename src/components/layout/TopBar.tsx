import { useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { tickTmo, resetPayment } from '@/store/slices/uiSlice';
import { setActiveBrand } from '@/store/slices/productsSlice';
import { clearCart } from '@/store/slices/cartSlice';
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
  const activeBrand = useAppSelector((state) => state.products.activeBrand);

  useEffect(() => {
    const interval = setInterval(() => dispatch(tickTmo()), 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleBrandChange = (brand: Brand) => {
    if (brand === activeBrand) return;
    dispatch(setActiveBrand(brand));
    dispatch(clearCart());
    dispatch(resetPayment());
  };

  return (
    <header className="bg-[#0a0e2e] text-white">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-5 py-2 text-xs font-bold">
        <span className="text-[17px] tracking-tight text-white font-extrabold">
          TMO: {formatTime(tmoSeconds)}
        </span>

        <div className="flex items-center gap-3">
          <BrandDropdown value={activeBrand} onChange={handleBrandChange} />
          <button
            type="button"
            aria-label="Cuenta de usuario"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FiUser size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages Sub-banner matching screenshot: solid white background, 2 columns with vertical divider line */}
      <div className="grid grid-cols-2 bg-white text-[#8c97a8] border-b border-slate-200">
        {/* Left column: MENSAJE DE TIENDA */}
        <div className="flex flex-col justify-center px-4 py-1.5 border-r border-slate-200">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c97a8]">
            <span className="text-red-600 text-xs">🚩</span>
            <span>MENSAJE DE TIENDA</span>
          </div>
          <div className="text-xs font-black tracking-tight text-[#d32f2f] uppercase mt-0.5">
            {storeMessage}
          </div>
        </div>

        {/* Right column: MENSAJE GERENCIAL */}
        <div className="flex flex-col justify-center px-4 py-1.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-[#8c97a8]">
            <span className="text-blue-500 text-xs">ℹ️</span>
            <span>MENSAJE GERENCIAL</span>
          </div>
          <div className="text-xs font-black tracking-tight text-[#d32f2f] uppercase mt-0.5">
            {managerMessage}
          </div>
        </div>
      </div>
    </header>
  );
}
