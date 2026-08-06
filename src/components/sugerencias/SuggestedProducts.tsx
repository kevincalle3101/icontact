import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import type { Product } from '@/types';

interface SuggestedProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function SuggestedProducts({ products, onAdd }: SuggestedProductsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Left carousel arrow */}
      <button
        type="button"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        title="Anterior"
      >
        <FiChevronLeft size={16} />
      </button>

      {/* Suggested products cards */}
      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {products.slice(0, 4).map((product, index) => (
          <article
            key={`${product.id}-${index}`}
            className="flex flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-center shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="text-2xl mb-1" aria-hidden="true">
              {product.emoji}
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-slate-800 leading-tight">
                {product.name}
              </h3>
              <p className="text-[11px] font-bold text-slate-900 mt-0.5">
                + S/ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Requirement: Blue info icon indicating manager discount applies */}
            <div className="mt-1.5 flex items-center justify-center gap-2">
              <span
                title="Aplica Descuento Gerencial"
                className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-xs bg-blue-500 text-[9px] font-bold text-white"
              >
                i
              </span>
              <button
                type="button"
                onClick={() => onAdd(product)}
                aria-label={`Agregar ${product.name} sugerido`}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0f172a] text-white hover:bg-slate-800 transition-colors"
              >
                <FiPlus size={12} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Right carousel arrow */}
      <button
        type="button"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        title="Siguiente"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
