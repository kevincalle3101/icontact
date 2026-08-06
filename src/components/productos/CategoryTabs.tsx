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
      className="flex flex-col gap-1 w-32 shrink-0 border-r border-slate-200 pr-2"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={category === active}
          onClick={() => onSelect(category)}
          className={clsx(
            'w-full text-left rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
            category === active
              ? 'bg-[#0f172a] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
