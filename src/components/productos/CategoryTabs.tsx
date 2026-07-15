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
      className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-px"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={category === active}
          onClick={() => onSelect(category)}
          className={clsx(
            'shrink-0 rounded-t-md px-3 py-2 text-sm font-medium transition-colors',
            category === active
              ? 'border-b-2 border-brand-navy bg-brand-navy/5 text-brand-navy'
              : 'text-slate-500 hover:bg-slate-100',
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
