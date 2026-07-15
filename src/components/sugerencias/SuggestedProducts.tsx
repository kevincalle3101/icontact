import { FiPlus } from 'react-icons/fi';
import type { Product } from '@/types';

interface SuggestedProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function SuggestedProducts({ products, onAdd }: SuggestedProductsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {products.slice(0, 4).map((product, index) => (
        <article
          key={`${product.id}-${index}`}
          className="flex flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-3 text-center"
        >
          <div className="text-3xl" aria-hidden="true">
            {product.emoji}
          </div>
          <h3 className="text-xs font-semibold text-slate-700">{product.name}</h3>
          <p className="text-xs font-bold text-red-600">+ S/ {product.price.toFixed(2)}</p>
          <button
            type="button"
            onClick={() => onAdd(product)}
            aria-label={`Agregar ${product.name} sugerido`}
            className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-white hover:bg-brand-navy-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy"
          >
            <FiPlus aria-hidden="true" />
          </button>
        </article>
      ))}
    </div>
  );
}
