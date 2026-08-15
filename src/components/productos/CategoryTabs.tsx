import clsx from '@/utils/clsx';
import type { ProductCategory } from '@/types';

interface CategoryTabsProps {
  categories: ProductCategory[];
  active: ProductCategory;
  onSelect: (category: ProductCategory) => void;
}

export default function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Categorías de productos"
      className="flex flex-col gap-1 w-28 sm:w-30 shrink-0 border-r border-slate-200/80 pr-1.5 overflow-y-auto max-h-full scrollbar-thin"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={category === active}
          onClick={() => onSelect(category)}
          className={clsx(
            'w-full text-left rounded-[7px] px-[10px] py-[7px] text-[10px] font-bold transition-all',
            category === active
              ? 'bg-[#1a1f5e] text-white shadow-xs'
              : 'text-[#475569] hover:bg-slate-100 hover:text-slate-900 font-semibold',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
