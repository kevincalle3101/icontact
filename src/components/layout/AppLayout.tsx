import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import SectionNav from '@/components/layout/SectionNav';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import OrderDeskLayout from '@/pages/OrderDeskLayout';

export default function AppLayout() {
  return (
    <div className="flex h-screen max-h-screen flex-col bg-[#eef2f8] overflow-hidden select-none">
      <TopBar />
      <SectionNav />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          {/* Desktop: all sections visible at once, mirroring reference layout */}
          <OrderDeskLayout />
          {/* Mobile/tablet: navigate between sections via routes */}
          <div className="lg:hidden h-full overflow-y-auto">
            <Outlet />
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
