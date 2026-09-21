import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from '@/shared/ui/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
