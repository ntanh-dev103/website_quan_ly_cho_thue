import { NavLink } from 'react-router-dom';
import { Users, LayoutGrid, Layers, Settings, LogOut, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export function AdminSidebar() {
  const { logout } = useAuthStore();
  const pendingMerchantsCount = 5; // Mock PENDING count

  const navItems = [
    { name: 'Tổng quan', to: '/admin', icon: BarChart3, exact: true, disabled: true },
    { name: 'Duyệt đối tác', to: '/admin/merchants', icon: Users, badge: pendingMerchantsCount },
    { name: 'Quản lý danh mục', to: '/admin/categories', icon: LayoutGrid },
    { name: 'Cấu hình Tiers', to: '/admin/tiers', icon: Layers },
    { name: 'Cài đặt hệ thống', to: '/admin/settings', icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-full shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Admin<span className="text-blue-500">Panel</span></h2>
        <p className="text-xs text-slate-500 mt-1">Super Administrator</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <div key={item.name}>
            {item.disabled ? (
              <div className="flex items-center px-4 py-3 rounded-xl text-slate-600 cursor-not-allowed">
                <item.icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                <span className="ml-auto text-[10px] uppercase font-bold bg-slate-800 px-2 py-0.5 rounded-full">Coming</span>
              </div>
            ) : (
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5 transition-transform group-hover:scale-110")} />
                <span className="font-medium">{item.name}</span>
                {item.badge ? (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700"
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
