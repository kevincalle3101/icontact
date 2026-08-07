import ClienteSection from '@/pages/ClienteSection';
import ProductosSection from '@/pages/ProductosSection';
import SugerenciasSection from '@/pages/SugerenciasSection';
import ResumenSection from '@/pages/ResumenSection';
import PagoSection from '@/pages/PagoSection';

export default function OrderDeskLayout() {
  return (
    <div className="hidden h-full gap-3 lg:grid lg:grid-cols-[279px_1fr_350px] items-start overflow-hidden">
      {/* Column 1: Section 1 (Cliente cards stack) */}
      <div className="flex flex-col gap-2.5 h-full overflow-y-auto pr-1 scrollbar-thin">
        <ClienteSection />
      </div>

      {/* Column 2: Section 2 (Carta - Productos) & Section 3 (Venta Sugestiva) fitting 100% height */}
      <div className="flex flex-col gap-2.5 h-full min-h-0 overflow-hidden">
        <ProductosSection />
        <SugerenciasSection />
      </div>

      {/* Column 3: Section 4 (Resumen Pedido) & Section 5 (Detalle de Pago) entwined as one scroll unit */}
      <div className="flex flex-col gap-2.5 h-full overflow-y-auto pr-1 scrollbar-thin">
        <ResumenSection />
        <PagoSection />
      </div>
    </div>
  );
}
