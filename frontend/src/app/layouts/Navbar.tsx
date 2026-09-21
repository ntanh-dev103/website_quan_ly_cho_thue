import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, LogOut, LogIn, User } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { MegaMenuNav } from '@/shared/ui/MegaMenuNav';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { toast } from 'sonner';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, role, tier, user, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Hide navbar on auth page
  if (location.pathname === '/auth') return null;

  const roleLinks = (() => {
    switch (role) {
      case 'MERCHANT':
        return <Link to="/merchant" className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 hidden md:block">Bảng điều khiển</Link>;
      case 'ADMIN':
        return <Link to="/admin" className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 hidden md:block">Quản trị</Link>;
      default:
        return null;
    }
  })();

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo & Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md shadow-primary-600/20">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 hidden sm:block">RentalShop</span>
              </Link>

              <MegaMenuNav />
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {roleLinks}
              
              {isAuthenticated ? (
                <>
                  <TierBadge role={role} tier={tier} size="sm" className="hidden sm:inline-flex" />
                  <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-gray-400 hover:text-destructive-500"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button size="sm">
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmLabel="Đăng xuất"
        variant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}
