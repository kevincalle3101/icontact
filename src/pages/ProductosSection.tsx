import { useEffect, useMemo } from 'react';
import SectionContainer from '@/components/shared/SectionContainer';
import Spinner from '@/components/shared/Spinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import SearchBar from '@/components/productos/SearchBar';
import CategoryTabs from '@/components/productos/CategoryTabs';
import ProductGrid from '@/components/productos/ProductGrid';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  BRAND_CATEGORIES,
  clearSearch,
  loadProductsByBrand,
  setActiveCategory,
  setSearchQuery,
} from '@/store/slices/productsSlice';
import { addItem } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

export default function ProductosSection() {
  const dispatch = useAppDispatch();
  const { activeBrand, allProducts, activeCategory, searchQuery, loading, error } =
    useAppSelector((state) => state.products);

  // Load products when brand changes
  useEffect(() => {
    dispatch(loadProductsByBrand(activeBrand));
  }, [activeBrand, dispatch]);

  // ------------------------------------------------------------------
  // Client-side filtering (no backend calls for search or category)
  // ------------------------------------------------------------------
  const productsToShow = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allProducts.filter((product) => {
      // Category filter: only apply when NOT searching (search searches full catalog)
      if (!query && product.category !== activeCategory) return false;

      // Search filter: match name or description
      if (query) {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [allProducts, activeCategory, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  const handleAdd = (product: Product, kitchenObs?: string) => {
    dispatch(addItem({ ...product, quantity: 1, kitchenObs }));
  };

  return (
    <SectionContainer
      title="2. CARTA - PRODUCTOS"
      titleClassName="text-[10px]"
      className="flex-1 flex flex-col text-[10px] min-h-0 border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden"
      contentClassName="flex-1 flex flex-col min-h-0 px-3 pb-3 overflow-hidden"
    >
      <div className="flex-1 flex flex-col min-h-0 gap-2 overflow-hidden">
        {/* Requirement: Full catalog search bar (client-side, instant) */}
        <SearchBar
          value={searchQuery}
          onChange={(value) => dispatch(setSearchQuery(value))}
          placeholder="Buscar en toda la carta..."
        />

        <div className="flex-1 flex min-h-0 gap-2 overflow-hidden">
          {/* Vertical category tabs on left side */}
          <CategoryTabs
            categories={BRAND_CATEGORIES[activeBrand]}
            active={activeCategory}
            onSelect={(category) => {
              if (isSearching) dispatch(clearSearch());
              dispatch(setActiveCategory(category));
            }}
          />

          {/* Product grid on right side */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {loading && <Spinner label="Cargando productos..." />}
            {error && !loading && (
              <ErrorMessage
                message={error}
                onRetry={() => dispatch(loadProductsByBrand(activeBrand))}
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
