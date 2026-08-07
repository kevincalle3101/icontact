import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product, kitchenObs?: string) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onAdd, compact = false }: ProductCardProps) {
  const [showObsModal, setShowObsModal] = useState(false);
  const [kitchenObs, setKitchenObs] = useState('');

  const handleConfirmAddModal = () => {
    onAdd(product, kitchenObs.trim());
    setKitchenObs('');
    setShowObsModal(false);
  };

  return (
    <>
      <article className="flex flex-col rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs transition-all hover:shadow-md justify-between min-h-[148px]">
        {/* Soft Cream/Beige Image Container */}
        <div
          className="flex h-18 items-center justify-center rounded-lg bg-[#fff8f0] text-3xl shrink-0 mb-1.5"
          aria-hidden="true"
        >
          {product.emoji}
        </div>

        {/* Text and Info Area */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-bold uppercase text-[#0b1021] leading-tight truncate">
              {product.name}
            </h3>
            {!compact && (
              <div className="mt-0.5 flex items-center justify-between gap-1">
                <p className="text-[10px] text-slate-400 leading-tight truncate flex-1">
                  {product.description}
                </p>
                {/* Requirement: Blue/Gray info icon for manager discount / details */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowObsModal(true);
                  }}
                  title="Ver detalle / Observación cocina"
                  className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-xs bg-[#64748b] text-[9px] font-bold text-white hover:opacity-80 transition-opacity"
                >
                  i
                </button>
              </div>
            )}
          </div>

          {/* Bottom Price & Add Button Row */}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-[#e4002b]">S/ {product.price.toFixed(2)}</span>
            <button
              type="button"
              onClick={() => onAdd(product)}
              aria-label={`Agregar ${product.name} al carrito`}
              className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#1a1f5e] text-white transition-colors hover:bg-[#252b7a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1f5e]"
            >
              <FiPlus size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>

      {/* Kitchen Obs Modal when clicking info icon */}
      {showObsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={() => setShowObsModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="text-xs font-bold uppercase text-slate-800">{product.name}</h4>
              <button
                type="button"
                onClick={() => setShowObsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="my-3">
              <p className="text-[11px] text-slate-500 mb-2">{product.description}</p>

              {/* Requirement: Obs. Cocina field for products without electivos / single products */}
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Obs. Cocina <span className="text-[10px] text-slate-400">(máx. 25 caract.)</span>
              </label>
              <input
                type="text"
                maxLength={25}
                value={kitchenObs}
                onChange={(e) => setKitchenObs(e.target.value)}
                placeholder="Ej: Twister sin lechuga / Sin sal"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-slate-800 focus:outline-none"
              />
              <div className="mt-1 text-right text-[10px] text-slate-400">
                {kitchenObs.length} / 25
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowObsModal(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAddModal}
                className="rounded-lg bg-[#0f172a] px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Agregar al pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
