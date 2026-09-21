import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/shared/ui/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
