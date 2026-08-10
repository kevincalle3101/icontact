import { useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import type { Product } from '@/types';

const PAGE_SIZE = 4;

interface SuggestedProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function SuggestedProducts({ products, onAdd }: SuggestedProductsProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const visibleProducts = useMemo(
    () => products.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [products, safePage],
  );

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="flex items-center gap-1.5">
      {/* Left carousel arrow */}
      <button
        type="button"
        onClick={goPrev}
        disabled={safePage === 0}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Anterior"
      >
        <FiChevronLeft size={14} />
      </button>

      {/* Suggested products cards */}
      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <article
            key={`${product.id}-${index}`}
            className="flex flex-col items-center rounded-xl border border-slate-200/90 bg-white p-1.5 text-center shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="text-lg" aria-hidden="true">
              {product.emoji}
            </div>
            <div>
              <h3 className="text-[9px] font-bold text-[#555555] leading-tight truncate max-w-[100px]">
                {product.name}
              </h3>
              <p className="text-[9px] text-[#555555]">
                + S/ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Info icon with tooltip for manager discount */}
            <div className="flex flex-col items-center gap-0.5">
              {product.appliesManagerDiscount && (
                <div className="relative group">
                  <span
                    className="text-[12px] cursor-help leading-none"
                    role="img"
                    aria-label="Información de descuento"
                  >
                    ℹ️
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10">
                    <div className="whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-[9px] font-medium text-white shadow-lg">
                      Sí aplica para descuento gerencial
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => onAdd(product)}
                aria-label={`Agregar ${product.name} sugerido`}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#1a1f5e] text-white hover:bg-[#252b7a] transition-colors"
              >
                <FiPlus size={11} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Right carousel arrow */}
      <button
        type="button"
        onClick={goNext}
        disabled={safePage >= totalPages - 1}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Siguiente"
      >
        <FiChevronRight size={14} />
      </button>
    </div>
  );
}
