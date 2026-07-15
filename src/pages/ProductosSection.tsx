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

  const handleAdd = (product: Product) => {
    dispatch(addItem({ ...product, quantity: 1 }));
    toast.success(`${product.name} agregado al pedido`);
  };

  const isSearching = searchQuery.trim().length > 0;
  const productsToShow = isSearching ? searchResults : (itemsByCategory[activeCategory] ?? []);

  return (
    <SectionContainer title="2. Carta - Productos" className="h-full">
      <div className="flex flex-col gap-4">
        <SearchBar value={searchQuery} onChange={(value) => dispatch(setSearchQuery(value))} />
        {!isSearching && (
          <CategoryTabs
            categories={PRODUCT_CATEGORIES}
            active={activeCategory}
            onSelect={(category) => dispatch(setActiveCategory(category))}
          />
        )}
        {loading && <Spinner label="Cargando productos..." />}
        {error && !loading && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(loadProductsByCategory(activeCategory))}
          />
        )}
        {!loading && !error && <ProductGrid products={productsToShow} onAdd={handleAdd} />}
      </div>
    </SectionContainer>
  );
}
