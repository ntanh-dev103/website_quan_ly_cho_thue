import { useLocation, Navigate, Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#F7FBFF] text-[#0F172A] overflow-x-hidden relative">
      {/* TOP HEADER: RentalShop Logo (Top-Left) */}
      <div className="absolute top-6 left-8 xl:left-12 z-30 hidden lg:block">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-[#D7E5F0] transition-transform group-hover:scale-105 shadow-md shadow-[#06B6D4]/10">
            <Package className="h-6 w-6 text-[#06B6D4]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#0F172A]">RentalShop</span>
        </Link>
      </div>

      {/* TOP RIGHT: "← Về trang chủ" White Translucent Glass Button */}
      <div className="absolute top-6 right-8 xl:right-12 z-30 hidden lg:block">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0F172A] hover:text-[#2563EB] bg-white/90 hover:bg-white px-4 py-2.5 rounded-xl backdrop-blur-md transition-all border border-[#D7E5F0] shadow-sm hover:shadow"
        >
          <ArrowLeft className="h-4 w-4 text-[#06B6D4]" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* LEFT 55%: Visual Marketing & 3D Rental Ecosystem */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden h-full border-r border-[#D7E5F0] bg-[#EEF8FF]">
        <div className="w-full h-full pt-16">
          <AuthProductShowcase />
        </div>
      </div>

      {/* RIGHT 45%: Login Experience */}
      <div className="flex-1 lg:w-[45%] flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-14 h-full overflow-y-auto bg-[#F8FAFC]">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#D7E5F0] text-[#06B6D4] shadow-sm">
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xl font-black text-[#0F172A]">RentalShop</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Main Glass Card Form Container (Begins ~70-90px from top) */}
        <div className="w-full max-w-md mx-auto my-auto pt-6 lg:pt-8 pb-4">
          <div className="rounded-[24px] bg-white/85 backdrop-blur-xl border border-[#D7E5F0] p-7 sm:p-9 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            {currentMode === 'login' && <LoginForm />}
            {currentMode === 'register' && <CustomerRegisterForm />}
            {currentMode === 'partner' && <MerchantRegisterForm />}
          </div>

          {/* Bottom Security Assurance */}
          <div className="text-center text-[11px] text-[#64748B] mt-5">
            Bằng việc tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của RentalShop.
          </div>
        </div>

        {/* Subtle Footer */}
        <div className="text-center text-[11px] text-[#94A3B8] py-2">
          &copy; {new Date().getFullYear()} RentalShop Technology Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
}
