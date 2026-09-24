import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, User, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { PasswordStrengthBar } from './PasswordStrengthBar';
import { useAuthStore } from '@/entities/user/useAuthStore';

export function CustomerRegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await register({ name, email, password }, 'CUSTOMER');
      toast.success('Đăng ký thành công! Chào mừng bạn đến với RentalShop.');
      navigate('/');
    } catch {
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1 mb-4 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Tạo tài khoản khách hàng
        </h2>
        <p className="text-xs text-[#64748B]">
          Đăng ký để thuê thiết bị, phương tiện và trang phục sự kiện.
        </p>
      </div>

      {/* Intro Subtitle */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#E0F2FE] border border-[#06B6D4]/30 text-[#0284C7] text-xs font-medium">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#06B6D4]" />
        <span>Nhận ngay hạng C1 và giảm tiền cọc khi thuê thiết bị.</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-name" className="text-xs font-semibold text-[#0F172A]">
            Họ và tên
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              id="reg-name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 h-11 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl"
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="text-xs font-semibold text-[#0F172A]">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              id="reg-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-password" className="text-xs font-semibold text-[#0F172A]">
            Mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrengthBar password={password} />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-confirm" className="text-xs font-semibold text-[#0F172A]">
            Xác nhận mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              id="reg-confirm"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-11 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl"
              autoComplete="new-password"
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-rose-500 font-medium">Mật khẩu xác nhận không khớp</p>
          )}
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          className="w-full h-11 font-bold text-base bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#0891B2] hover:to-[#1D4ED8] text-white shadow-lg shadow-[#06B6D4]/20 rounded-xl mt-2 cursor-pointer border-0" 
          size="lg" 
          loading={isLoading}
        >
          Đăng ký tài khoản khách hàng
        </Button>
      </form>

      {/* Already have account? Login */}
      <div className="text-center pt-1">
        <p className="text-xs text-[#64748B]">
          Đã có tài khoản?{' '}
          <Link 
            to="/login" 
            className="font-bold text-[#06B6D4] hover:text-[#2563EB] transition-colors inline-flex items-center gap-1"
          >
            <span>Đăng nhập</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>

      {/* Prominent B2B Partner Invitation Banner */}
      <div className="mt-3 p-3.5 rounded-2xl bg-[#EEF8FF] border border-[#D7E5F0]">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#0F172A] font-bold text-xs">
            <Store className="h-4 w-4 text-[#8B5CF6]" />
            <span>Bạn muốn đăng ký đối tác cho thuê?</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-snug">
            Kiếm thêm thu nhập từ xe, máy ảnh, trang phục nhàn rỗi hoặc đăng ký doanh nghiệp B2B với hoa hồng sàn 2%.
          </p>
        </div>
        <div className="mt-2.5 pt-2 border-t border-[#D7E5F0] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">Kênh thương gia & đối tác:</span>
          <Link
            to="/partner"
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#8B5CF6] hover:bg-purple-600 px-3 py-1.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <span>Đăng ký đối tác B2B</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
