import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, Wallet, LogOut } from 'lucide-react';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export function MerchantSidebar() {
  const { logout } = useAuthStore();
  const pendingContractsCount = 3; // Mock PENDING count

  const navItems = [
    { name: 'Dashboard', to: '/merchant', icon: LayoutDashboard, exact: true },
    { name: 'Kho hàng', to: '/merchant/inventory', icon: Package },
    { name: 'Đơn hàng', to: '/merchant/contracts', icon: FileText, badge: pendingContractsCount },
    { name: 'Tài chính', to: '/merchant/finance', icon: Wallet, disabled: true },
  ];

  return (
    <aside className="w-64 bg-[#1E1B4B] text-white flex flex-col h-full shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-white/90">Merchant<span className="text-primary-400">Portal</span></h2>
        <p className="text-xs text-white/50 mt-1">Quản lý cửa hàng</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <div key={item.name}>
            {item.disabled ? (
              <div className="flex items-center px-4 py-3 rounded-xl text-white/30 cursor-not-allowed">
                <item.icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                <span className="ml-auto text-[10px] uppercase font-bold bg-white/10 px-2 py-0.5 rounded-full">v2</span>
              </div>
            ) : (
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary-600/90 text-white shadow-lg shadow-primary-900/50" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 transition-transform group-hover:scale-110")} />
                <span className="font-medium">{item.name}</span>
                {item.badge ? (
                  <span className="ml-auto bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  );
}
