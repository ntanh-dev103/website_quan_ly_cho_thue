import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from '@/shared/ui/Footer';

export function PublicLayout() {
  const location = useLocation();
  const authPaths = ['/auth', '/login', '/register', '/partner'];
  const isAuthPage = authPaths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));

  if (isAuthPage) {
    return (
      <main className="min-h-screen w-full bg-[#F7FBFF]">
        <Outlet />
      </main>
    );
  }

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
