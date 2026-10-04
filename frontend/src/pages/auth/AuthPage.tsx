/* Hallmark · component: AuthPage · genre: modern-minimal · theme: Indigo/Slate
 * philosophy: Dual-split responsive layout, tactile card framing, seamless auth-mode tabs, zero-slop typography
 */
import { useLocation, Navigate, Link } from 'react-router-dom';
import { Compass, ArrowLeft, Building2, User, LogIn } from 'lucide-react';
import { LoginForm } from '@/features/auth/LoginForm';
import { CustomerRegisterForm } from '@/features/auth/CustomerRegisterForm';
import { MerchantRegisterForm } from '@/features/auth/MerchantRegisterForm';
import { AuthProductShowcase } from '@/features/auth/AuthProductShowcase';
import { useAuthStore } from '@/entities/user/useAuthStore';

interface AuthPageProps {
  mode?: 'login' | 'register' | 'partner';
}

export function AuthPage({ mode }: AuthPageProps) {
  const location = useLocation();
  const { isAuthenticated, role } = useAuthStore();

  // Determine current mode by prop or route pathname
  const currentMode: 'login' | 'register' | 'partner' = (() => {
    if (mode) return mode;
    if (location.pathname.startsWith('/register')) return 'register';
    if (location.pathname.startsWith('/partner')) return 'partner';
    return 'login';
  })();

  // Redirect if already logged in
  if (isAuthenticated) {
    switch (role) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />;
      case 'MERCHANT':
        return <Navigate to="/merchant" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 overflow-x-clip relative">
      {/* Top Header on Desktop: Logo and Back Button */}
      <header className="absolute top-0 left-0 right-0 z-30 hidden lg:flex items-center justify-between px-8 xl:px-12 py-5 pointer-events-none">
        <Link to="/" className="inline-flex items-center gap-3 group pointer-events-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-500/20 transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white">RentHub</span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Rental Platform</span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white/90 hover:bg-white px-3.5 py-2 rounded-lg transition-all border border-slate-200 shadow-sm pointer-events-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>
      </header>

      {/* LEFT 50%: Visual Ecosystem Showcase */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[52%] relative overflow-hidden h-screen border-r border-slate-800 bg-slate-900">
        <div className="w-full h-full pt-20">
          <AuthProductShowcase />
        </div>
      </div>

      {/* RIGHT 50%: Auth Form Container */}
      <div className="flex-1 lg:w-1/2 xl:w-[48%] flex flex-col justify-between p-5 sm:p-8 lg:p-12 xl:p-16 min-h-screen lg:h-screen lg:overflow-y-auto bg-slate-50">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
              <Compass className="h-4 w-4" />
            </div>
            <span className="text-lg font-black text-slate-900">RentHub</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-lg mx-auto my-auto py-6 sm:py-8">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 p-1 mb-6 rounded-xl bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-600">
            <Link
              to="/login"
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                currentMode === 'login'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              to="/register"
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                currentMode === 'register'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Đăng ký thuê</span>
            </Link>
            <Link
              to="/partner"
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
                currentMode === 'partner'
                  ? 'bg-white text-indigo-700 shadow-sm font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Đối tác shop</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
            {currentMode === 'login' && <LoginForm />}
            {currentMode === 'register' && <CustomerRegisterForm />}
            {currentMode === 'partner' && <MerchantRegisterForm />}
          </div>

          {/* Legal / Privacy note */}
          <p className="text-center text-[11px] text-slate-500 mt-4 leading-relaxed">
            Bằng việc tiếp tục, bạn đồng ý với <a href="#" className="underline hover:text-slate-800">Điều khoản sử dụng</a> và <a href="#" className="underline hover:text-slate-800">Chính sách bảo mật thông tin</a> của RentHub.
          </p>
        </div>

        {/* Bottom copyright */}
        <footer className="text-center text-xs text-slate-400 py-2 border-t border-slate-200/60 mt-4">
          &copy; {new Date().getFullYear()} RentHub Technology Platform. Nền tảng cho thuê tài sản thông minh.
        </footer>
      </div>
    </div>
  );
}
