import type { ReactNode } from 'react';
import clsx from '@/utils/clsx';

interface SectionContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
  contentClassName?: string;
}

export default function SectionContainer({
  title,
  children,
  className,
  actions,
  contentClassName,
}: SectionContainerProps) {
  return (
    <section
      aria-label={title}
      className={clsx(
        'flex flex-col rounded-lg bg-white shadow-sm ring-1 ring-slate-200',
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-slate-700">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      <div className={clsx('flex-1 p-4', contentClassName)}>{children}</div>
    </section>
  );
}
