import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import SectionNav from '@/components/layout/SectionNav';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import OrderDeskLayout from '@/pages/OrderDeskLayout';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <TopBar />
      <SectionNav />
      <main className="flex-1 p-3 sm:p-4">
        <ErrorBoundary>
          {/* Desktop: all sections visible at once, mirroring the reference layout */}
          <OrderDeskLayout />
          {/* Mobile/tablet: navigate between sections via routes */}
          <div className="lg:hidden">
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
