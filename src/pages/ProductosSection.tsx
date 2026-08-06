import { useEffect } from 'react';
import { toast } from 'react-toastify';
import SectionContainer from '@/components/shared/SectionContainer';
import Spinner from '@/components/shared/Spinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import SearchBar from '@/components/productos/SearchBar';
import CategoryTabs from '@/components/productos/CategoryTabs';
import ProductGrid from '@/components/productos/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  PRODUCT_CATEGORIES,
  clearSearch,
  loadProductsByCategory,
  runProductSearch,
  setActiveCategory,
  setSearchQuery,
} from '@/store/slices/productsSlice';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

export default function ProductosSection() {
  const dispatch = useAppDispatch();
  const { activeCategory, itemsByCategory, searchQuery, searchResults, loading, error } =
    useAppSelector((state) => state.products);

  useEffect(() => {
    if (!itemsByCategory[activeCategory]) {
      dispatch(loadProductsByCategory(activeCategory));
    }
  }, [activeCategory, itemsByCategory, dispatch]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(runProductSearch(searchQuery));
      } else {
        dispatch(clearSearch());
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [searchQuery, dispatch]);

  const handleAdd = (product: Product, kitchenObs?: string) => {
    dispatch(addItem({ ...product, quantity: 1, kitchenObs }));
    toast.success(`${product.name} agregado al pedido`);
  };

  const isSearching = searchQuery.trim().length > 0;
  const productsToShow = isSearching ? searchResults : (itemsByCategory[activeCategory] ?? []);

  return (
    <SectionContainer
      title="2. CARTA - PRODUCTOS"
      className="flex-1 flex flex-col min-h-0 border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden"
      contentClassName="flex-1 flex flex-col min-h-0 p-2.5 overflow-hidden"
    >
      <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden">
        {/* Requirement: Full catalog search bar */}
        <SearchBar
          value={searchQuery}
          onChange={(value) => dispatch(setSearchQuery(value))}
          placeholder="Buscar en esta categoría..."
        />

        <div className="flex-1 flex min-h-0 gap-2 overflow-hidden">
          {/* Vertical category tabs on left side */}
          <CategoryTabs
            categories={PRODUCT_CATEGORIES}
            active={activeCategory}
            onSelect={(category) => {
              if (isSearching) dispatch(setSearchQuery(''));
              dispatch(setActiveCategory(category));
            }}
          />

          {/* Product grid on right side */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {loading && <Spinner label="Cargando productos..." />}
            {error && !loading && (
              <ErrorMessage
                message={error}
                onRetry={() => dispatch(loadProductsByCategory(activeCategory))}
              />
            )}
            {!loading && !error && (
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
                <ProductGrid products={productsToShow} onAdd={handleAdd} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
