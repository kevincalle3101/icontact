import ClienteSection from '@/pages/ClienteSection';
import ProductosSection from '@/pages/ProductosSection';
import SugerenciasSection from '@/pages/SugerenciasSection';
import ResumenSection from '@/pages/ResumenSection';
import PagoSection from '@/pages/PagoSection';

/**
 * Desktop layout that mirrors the reference POS screen: all five sections
 * are visible at once on large screens (>=1024px), matching the target
 * design. On smaller screens, users navigate via the section tabs and only
 * the active route's section is shown (see routing in App.tsx).
 */
export default function OrderDeskLayout() {
  return (
    <div className="hidden gap-4 lg:grid lg:grid-cols-[320px_1fr_360px]">
      <div className="flex flex-col gap-4">
        <ClienteSection />
      </div>
      <div className="flex flex-col gap-4">
        <ProductosSection />
        <SugerenciasSection />
      </div>
      <div className="flex flex-col gap-4">
        <ResumenSection />
        <PagoSection />
      </div>
    </div>
  );
}
