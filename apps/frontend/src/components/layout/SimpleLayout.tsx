// @/components/layout/SimpleLayout.tsx
import Header from '@/components/layout/Header.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer.tsx';

export function SimpleLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showSearch={false} />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
