import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Shield, TrendingUp, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { LoginForm } from '@/features/auth/LoginForm';
import { CustomerRegisterForm } from '@/features/auth/CustomerRegisterForm';
import { MerchantRegisterForm } from '@/features/auth/MerchantRegisterForm';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { cn } from '@/shared/lib/utils';

type RoleTab = 'customer' | 'merchant';
type ModeTab = 'login' | 'register';

const FEATURES = [
  {
    icon: Package,
    title: 'Hàng ngàn sản phẩm',
    description: 'Đa dạng danh mục cho thuê, từ thiết bị đến đồ dùng cá nhân.',
  },
  {
    icon: Shield,
    title: 'An toàn & bảo mật',
    description: 'Hệ thống đặt cọc thông minh theo hạng thành viên.',
  },
  {
    icon: TrendingUp,
    title: 'Nền tảng cho đối tác',
    description: 'Quản lý hàng hóa, theo dõi doanh thu và hoa hồng dễ dàng.',
  },
  {
    icon: Star,
    title: 'Hệ thống phân hạng',
    description: 'Thuê nhiều hơn, được ưu đãi nhiều hơn. Lên hạng Kim cương 💎.',
  },
];

export function AuthPage() {
  const { isAuthenticated, role } = useAuthStore();
  const [roleTab, setRoleTab] = useState<RoleTab>('customer');
  const [modeTab, setModeTab] = useState<ModeTab>('login');

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
    <div className="min-h-screen flex">
      {/* LEFT PANEL - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary-400/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          {/* Logo */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Package className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">RentalShop</span>
            </div>
            <p className="text-white/60 text-sm font-light">Nền tảng cho thuê đồ dùng hàng đầu</p>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Thuê bất cứ thứ gì,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200">
              mọi lúc, mọi nơi.
            </span>
          </h1>
          <p className="text-lg text-white/70 mb-12 max-w-md leading-relaxed">
            Tiết kiệm chi phí, giảm lãng phí. Kết nối người cần thuê với hàng ngàn đối tác cho thuê uy tín.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-4 hover:bg-white/[0.12] transition-all duration-300"
              >
                <feature.icon className="h-5 w-5 text-primary-200 mb-2.5 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[#F9FAFB]">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RentalShop</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {modeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </h2>
            <p className="text-gray-500">
              {modeTab === 'login'
                ? 'Chào mừng bạn quay lại! Vui lòng đăng nhập.'
                : 'Tạo tài khoản mới để bắt đầu sử dụng.'}
            </p>
          </div>

          {/* Role Toggle */}
          <Tabs value={roleTab} onValueChange={(v) => setRoleTab(v as RoleTab)} className="mb-6">
            <TabsList className="w-full">
              <TabsTrigger value="customer" className="flex-1">
                🛒 Khách hàng
              </TabsTrigger>
              <TabsTrigger value="merchant" className="flex-1">
                🏪 Đối tác
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mode Toggle */}
          <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setModeTab('login')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer',
                modeTab === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setModeTab('register')}
              className={cn(
                'flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer',
                modeTab === 'register'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Đăng ký
            </button>
          </div>

          {/* Form Content */}
          <div className="animate-fade-in" key={`${roleTab}-${modeTab}`}>
            {modeTab === 'login' ? (
              <LoginForm />
            ) : roleTab === 'customer' ? (
              <CustomerRegisterForm />
            ) : (
              <MerchantRegisterForm />
            )}
          </div>

          {/* Footer toggle */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {modeTab === 'login' ? (
              <>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setModeTab('register')}
                  className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setModeTab('login')}
                  className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
