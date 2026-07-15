import { NavLink } from 'react-router-dom';
import clsx from '@/utils/clsx';

const NAV_ITEMS = [
  { to: '/cliente', label: '1. Cliente' },
  { to: '/productos', label: '2. Productos' },
  { to: '/sugerencias', label: '3. Sugerencias' },
  { to: '/resumen', label: '4. Resumen' },
  { to: '/pago', label: '5. Pago' },
];

export default function SectionNav() {
  return (
    <nav
      aria-label="Secciones del pedido"
      className="flex gap-1 overflow-x-auto bg-white px-2 py-1.5 shadow-sm lg:hidden"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
              isActive ? 'bg-brand-navy text-white' : 'text-slate-500 hover:bg-slate-100',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
