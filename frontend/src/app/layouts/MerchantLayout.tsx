import { Outlet } from 'react-router-dom';
import { MerchantSidebar } from '@/shared/ui/MerchantSidebar';

export function MerchantLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
      <MerchantSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
