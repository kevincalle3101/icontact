import type { ReactNode } from 'react';
import clsx from '@/utils/clsx';

interface SectionContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  contentClassName?: string;
  titleClassName?: string;
}

export default function SectionContainer({
  title,
  children,
  className,
  actions,
  contentClassName,
  titleClassName,
}: SectionContainerProps) {
  return (
    <section
      aria-label={title}
      className={clsx(
        'flex flex-col rounded-lg bg-white shadow-sm ring-1 ring-slate-200',
        className,
      )}
    >
      <header className="flex items-center justify-between px-3 pt-3 pb-2">
        <h2 className={clsx('font-bold uppercase tracking-wide text-[#7b869d]', titleClassName ?? 'text-[11px]')}>{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className={clsx('flex-1 px-3 pb-3', contentClassName)}>{children}</div>
    </section>
  );
}
