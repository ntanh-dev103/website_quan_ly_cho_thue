import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ShoppingBag, 
  Menu, 
  X, 
  Tag, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { SpotlightCmdBar } from '@/features/search/SpotlightCmdBar';
import { GhostCartDrawer } from '@/features/cart/GhostCartDrawer';
import { toast } from 'sonner';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, tier, user, logout } = useAuthStore();
  const { items, setIsOpen: setCartOpen } = useGhostCartStore();
  const totalItems = items.length;
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll detection for subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hide navbar on auth pages
  const authPaths = ['/auth', '/login', '/register', '/partner'];
  if (authPaths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`))) return null;

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công');
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 ${
          isScrolled ? 'shadow-sm border-b border-gray-200/80' : 'border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* LEFT: RentHub Logo (Bold text, primary color) */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight text-primary-600 leading-none">
                    RentHub
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                    Marketplace
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Visual Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-auto">
              <div 
                onClick={() => setIsCmdOpen(true)}
                className="w-full relative flex items-center bg-gray-50 hover:bg-gray-100/90 border border-gray-200/90 hover:border-primary-300 rounded-lg py-2 pl-3.5 pr-2 cursor-pointer transition-all shadow-inner group"
              >
                <Search className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors mr-2.5 shrink-0" />
                <span className="text-sm text-gray-400 select-none flex-1 truncate">
                  Tìm thiết bị, danh mục, gói kit...
                </span>
                <div className="flex items-center gap-1 bg-white border border-gray-200 text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Actions (Khuyến mãi, Bell, Cart, User / Login) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Promotion link (Hidden on mobile) */}
              <Link 
                to="/catalog?promotions=true" 
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Tag className="h-3.5 w-3.5 text-accent-500" />
                <span>Khuyến mãi</span>
              </Link>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                onClick={() => setIsCmdOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Bell Icon (Notifications with subtle red dot) */}
              <button 
                type="button"
                onClick={() => toast.info('Thông báo', { description: 'Bạn chưa có thông báo mới nào.' })}
                className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Thông báo"
                title="Thông báo"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive-500 ring-2 ring-white" />
              </button>

              {/* Cart Icon Button (Ghost Cart) */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50/60 transition-colors"
                aria-label="Giỏ đồ thuê"
                title="Giỏ đồ thuê"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-primary-600 text-white text-[11px] font-bold shadow-sm animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Avatar Circle OR Đăng nhập Ghost Button */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 pl-1">
                  <div 
                    onClick={() => navigate(role === 'MERCHANT' ? '/merchant' : role === 'ADMIN' ? '/admin' : '/catalog')}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title={`Tài khoản: ${user.name}`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-xs ring-2 ring-primary-500/20">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 hidden xl:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="hidden sm:inline-flex text-gray-400 hover:text-destructive-500 h-8 w-8"
                    title="Đăng xuất"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="rounded-lg text-xs font-medium text-gray-700 hover:text-primary-600">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/partner">
                    <Button variant="outline" size="sm" className="rounded-lg text-xs font-semibold border-primary-200 text-primary-700 hover:bg-primary-50">
                      Đối tác
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Mở menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in md:hidden">
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                <Compass className="h-4 w-4" />
              </div>
              <span className="text-lg font-black text-primary-600">RentHub</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Đóng menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Search Trigger in Drawer */}
            <div
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCmdOpen(true);
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500"
            >
              <Search className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium">Tìm kiếm trên RentHub (⌘K)</span>
            </div>

            {/* Quick Links */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Điều hướng</span>
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-800"
              >
                <span>Trang chủ</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                to="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-semibold text-gray-800"
              >
                <span>Tất cả sản phẩm & Danh mục</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                to="/catalog?promotions=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-semibold text-primary-600"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent-500" />
                  <span>Ưu đãi & Khuyến mãi</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                to="/partner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 font-semibold text-emerald-600"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Trở thành Đối tác RentHub</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>

            {/* User State */}
            <div className="pt-4 border-t border-gray-100">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-gray-900 block truncate">{user.name}</span>
                      <span className="text-xs text-gray-500 block truncate">{user.email}</span>
                    </div>
                    <TierBadge role={role} tier={tier} size="sm" showLabel={false} />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-destructive-600 border-destructive-200 hover:bg-destructive-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button className="w-full rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button variant="outline" className="w-full rounded-xl font-semibold border-gray-300">
                      Đăng ký tài khoản
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spotlight Command Bar (⌘K Modal) */}
      <SpotlightCmdBar isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />

      {/* Ghost Cart Slide-Over Drawer */}
      <GhostCartDrawer />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi RentHub?"
        confirmLabel="Đăng xuất"
        variant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}
