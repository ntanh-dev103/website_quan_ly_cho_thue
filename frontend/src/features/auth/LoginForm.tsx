import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/useAuthStore';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
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
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="login-email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="login-password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="flex justify-end">
        <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
          Quên mật khẩu?
        </button>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" loading={isLoading}>
        Đăng nhập
      </Button>

      {/* Demo hint */}
      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-1">
        <p className="text-xs font-medium text-gray-500">💡 Tài khoản demo:</p>
        <div className="text-xs text-gray-400 space-y-0.5">
          <p><code className="text-primary-600">admin@test.com</code> → Quản trị viên</p>
          <p><code className="text-primary-600">merchant@test.com</code> → Đối tác (M2)</p>
          <p><code className="text-primary-600">gold@test.com</code> → Khách Vàng (C3)</p>
          <p><code className="text-primary-600">user@test.com</code> → Khách Cơ bản (C1)</p>
        </div>
      </div>
    </form>
  );
}
