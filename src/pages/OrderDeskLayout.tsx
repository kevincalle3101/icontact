import ClienteSection from '@/pages/ClienteSection';
import ProductosSection from '@/pages/ProductosSection';
import SugerenciasSection from '@/pages/SugerenciasSection';
import ResumenSection from '@/pages/ResumenSection';
import PagoSection from '@/pages/PagoSection';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart, selectCartItems } from '@/store/slices/cartSlice';

export default function OrderDeskLayout() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="hidden h-full gap-3 lg:grid lg:grid-cols-[279px_1fr_350px] items-start overflow-hidden">
      {/* Column 1: Section 1 (Cliente cards stack) */}
      <div className="flex flex-col gap-2.5 h-full overflow-y-auto pt-2.5 sm:pt-3 pb-2.5 sm:pb-3 pl-2.5 sm:pl-3 pr-1 scrollbar-thin">
        <ClienteSection />
      </div>

      {/* Column 2: Section 2 (Carta - Productos) & Section 3 (Venta Sugestiva) fitting 100% height */}
      <div className="flex flex-col gap-2.5 h-full min-h-0 overflow-hidden pt-2.5 sm:pt-3 pb-2.5 sm:pb-3">
        <ProductosSection />
        <SugerenciasSection />
      </div>

      {/* Column 3: Sections 4 (Resumen) & 5 (Pago) inside a single card, buttons sticky at bottom */}
      <div className="h-full flex flex-col overflow-hidden">
        <section className="flex flex-col flex-1 min-h-0 bg-white shadow-2xs">
          {/* Header scrolls away with the rest of the content — only the
              CONTINUAR bar at the bottom stays pinned. */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
            <div className="flex items-center justify-between pt-3 pb-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#8892b0]">
                4. Resumen Pedido
              </h2>
              <button
                type="button"
                onClick={handleClearCart}
                disabled={items.length === 0}
                className="text-[14px] text-[#bbbbbb] hover:text-red-600 disabled:opacity-40 transition-colors"
                title="Limpiar carrito"
                aria-label="Limpiar carrito"
              >
                🗑
              </button>
            </div>
            <ResumenSection embedded />
            <PagoSection embedded />
          </div>
          {/* Sticky bottom bar with CONTINUAR + Cancelar */}
          <div className="shrink-0 border-t border-slate-200 px-3 py-3 flex flex-col items-center gap-2 bg-white rounded-b-2xl">
            <button
              type="submit"
              form="pago-form"
              disabled={items.length === 0}
              className={`w-full rounded-xl py-3 text-[14px] font-bold uppercase tracking-wider transition-colors ${
                items.length === 0
                  ? 'bg-[#c8d6e5] text-white cursor-not-allowed'
                  : 'bg-[#1a1f5e] text-white shadow-sm hover:bg-[#252b7a]'
              }`}
            >
              CONTINUAR
            </button>
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="text-[10px] font-semibold text-slate-500 underline hover:text-slate-800"
            >
              Cancelar pedido
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
