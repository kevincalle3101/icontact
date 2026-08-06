import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product, kitchenObs?: string) => void;
}

export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-6 text-center text-xs text-slate-400">No se encontraron productos.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {products.slice(0, 10).map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
