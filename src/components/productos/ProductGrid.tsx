import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-400">No se encontraron productos.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.slice(0, 10).map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
