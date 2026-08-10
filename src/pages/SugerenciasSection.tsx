import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SectionContainer from '@/components/shared/SectionContainer';
import Spinner from '@/components/shared/Spinner';
import SuggestedProducts from '@/components/sugerencias/SuggestedProducts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadSuggestedProducts } from '@/store/slices/productsSlice';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

export default function SugerenciasSection() {
  const dispatch = useAppDispatch();
  const { suggested, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (suggested.length === 0) {
      dispatch(loadSuggestedProducts());
    }
  }, [suggested.length, dispatch]);

  const handleAdd = (product: Product) => {
    dispatch(addItem({ ...product, quantity: 1 }));
    toast.success(`${product.name} agregado al pedido`);
  };

  return (
    <SectionContainer
      title="3. VENTA SUGESTIVA"
      className="shrink-0 border border-slate-200 bg-white rounded-2xl shadow-xs"
      contentClassName="px-3 pb-3"
    >
      {loading && suggested.length === 0 ? (
        <Spinner label="Cargando sugerencias..." />
      ) : (
        <SuggestedProducts products={suggested} onAdd={handleAdd} />
      )}
    </SectionContainer>
  );
}
