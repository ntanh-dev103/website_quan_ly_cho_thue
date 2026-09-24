import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ChevronDown, ChevronUp, UserCheck, ArrowRight, Bot } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/useAuthStore';

interface DemoAccount {
  email: string;
  label: string;
  roleDesc: string;
  badgeStyle: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: 'admin@test.com', label: 'Admin', roleDesc: 'Quản trị viên sàn', badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
  { email: 'merchant@test.com', label: 'Đối tác', roleDesc: 'Chủ shop / Doanh nghiệp', badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { email: 'gold@test.com', label: 'Khách VIP', roleDesc: 'Hạng Vàng giảm 25% cọc', badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { email: 'user@test.com', label: 'Khách hàng', roleDesc: 'Thành viên mới C1', badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
];

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    try {
      await login(email, password);
      const role = useAuthStore.getState().role;

      toast.success('Đăng nhập thành công!');

      switch (role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'MERCHANT':
          navigate('/merchant');
          break;
        default:
          navigate('/');
      }
    } catch {
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    toast.success(`Đã tự động chọn tài khoản: ${demoEmail}`);
  };

  const handleForgotPassword = () => {
    toast.info('Bản Demo: Mọi mật khẩu từ 6 ký tự đều hợp lệ. Hoặc mở thẻ "Tài khoản trải nghiệm" để chọn nhanh!', {
      duration: 5000,
    });
  };

  return (
    <div className="relative space-y-4">
      {/* Title & Subheading */}
      <div className="space-y-1 mb-6 text-left">
        <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-[#0F172A]">
          Đăng nhập tài khoản
        </h2>
        <p className="text-sm text-[#64748B]">
          Quản lý đơn thuê, tài sản và giao dịch của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field (52px height) */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-xs font-semibold text-[#0F172A]">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
            <Input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-[52px] bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl text-sm transition-all"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password Field (52px height) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-xs font-semibold text-[#0F172A]">
              Mật khẩu
            </Label>
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-xs text-[#06B6D4] hover:text-[#2563EB] font-medium transition-colors cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 pr-11 h-[52px] bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl text-sm transition-all"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer p-1"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Primary CTA (54px height) */}
        <Button 
          type="submit" 
          className="w-full h-[54px] font-bold text-base bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#0891B2] hover:to-[#1D4ED8] text-white shadow-lg shadow-[#06B6D4]/20 rounded-xl mt-2 cursor-pointer border-0 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]" 
          size="lg" 
          loading={isLoading}
        >
          <span>Đăng nhập</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Switch to Register link */}
      <div className="text-center pt-2">
        <p className="text-sm text-[#64748B]">
          Chưa có tài khoản?{' '}
          <Link 
            to="/register" 
            className="font-bold text-[#06B6D4] hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
          >
            <span>Đăng ký ngay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>

      {/* Compact Collapsible Demo Account Card */}
      <div className="mt-3 rounded-2xl bg-[#F8FAFC] border border-[#D7E5F0] overflow-hidden transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsDemoOpen(!isDemoOpen)}
          className="w-full flex items-center justify-between p-3.5 text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E0F2FE] text-[#06B6D4]">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">Tài khoản trải nghiệm</span>
              <span className="text-[11px] text-[#64748B] block">Click để tự động điền</span>
            </div>
          </div>
          {isDemoOpen ? (
            <ChevronUp className="h-4 w-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#64748B]" />
          )}
        </button>

        {isDemoOpen && (
          <div className="p-3 pt-0 border-t border-[#D7E5F0]/60 grid grid-cols-2 gap-2 mt-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleFillDemo(acc.email)}
                className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${acc.badgeStyle}`}
              >
                <span className="font-bold text-xs">{acc.label}</span>
                <span className="text-[10px] opacity-80 truncate w-full">{acc.roleDesc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Small 3D Support Robot Assistant (Bottom Right) */}
      <div className="pt-2 flex items-center justify-end">
        <div className="flex items-end gap-2.5">
          {/* Speech bubble */}
          <div className="relative px-3.5 py-1.5 rounded-2xl rounded-br-none bg-white border border-[#D7E5F0] text-[11px] font-medium text-[#0F172A] shadow-md shadow-slate-200/50">
            <span>Bạn cần hỗ trợ? Tôi luôn ở đây!</span>
          </div>

          {/* Small 3D Robot Head */}
          <div className="relative group cursor-pointer" title="Trợ lý ảo RentalShop">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-[#E0F2FE] border border-[#06B6D4]/40 shadow-lg shadow-[#06B6D4]/15 text-[#06B6D4] transition-transform duration-300 group-hover:scale-110">
              <Bot className="h-5 w-5 text-[#06B6D4] animate-bounce" />
              {/* Glowing cyan eye */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
