import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ClienteSection from '@/pages/ClienteSection';
import ProductosSection from '@/pages/ProductosSection';
import SugerenciasSection from '@/pages/SugerenciasSection';
import ResumenSection from '@/pages/ResumenSection';
import PagoSection from '@/pages/PagoSection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/cliente" replace />} />
        <Route path="cliente" element={<ClienteSection />} />
        <Route path="productos" element={<ProductosSection />} />
        <Route path="sugerencias" element={<SugerenciasSection />} />
        <Route path="resumen" element={<ResumenSection />} />
        <Route path="pago" element={<PagoSection />} />
        <Route path="*" element={<Navigate to="/cliente" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
