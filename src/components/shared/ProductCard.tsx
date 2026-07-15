import { FiInfo, FiPlus } from 'react-icons/fi';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onAdd, compact = false }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-rose-50/60 p-3 transition-shadow hover:shadow-md">
      <div
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-rose-100 text-4xl"
        aria-hidden="true"
      >
        {product.emoji}
      </div>
      <h3 className="text-xs font-bold uppercase text-slate-800">{product.name}</h3>
      {!compact && (
        <p className="mt-1 flex-1 text-[11px] leading-snug text-slate-500">
          {product.description}
          <FiInfo className="ml-1 inline-block text-slate-400" aria-hidden="true" />
        </p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-red-600">S/ {product.price.toFixed(2)}</span>
        <button
          type="button"
          onClick={() => onAdd(product)}
          aria-label={`Agregar ${product.name} al carrito`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-white transition-colors hover:bg-brand-navy-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          <FiPlus aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
