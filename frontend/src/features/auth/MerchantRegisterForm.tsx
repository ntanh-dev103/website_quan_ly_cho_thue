import { useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Building2, FileText, Upload, X } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { PasswordStrengthBar } from './PasswordStrengthBar';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { cn } from '@/shared/lib/utils';

export function MerchantRegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    } else {
      toast.error('Chỉ chấp nhận file ảnh (JPG, PNG)');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast.error('Chỉ chấp nhận file ảnh (JPG, PNG)');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!companyName || !taxCode || !email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await register(
        { companyName, taxCode, email, password, businessLicense: file ?? undefined },
        'MERCHANT'
      );
      toast.success('Đăng ký đối tác thành công! Tài khoản đang chờ xét duyệt.');
      navigate('/merchant');
    } catch {
      toast.error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="merch-company">Tên công ty / cửa hàng</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="merch-company"
            placeholder="Công ty TNHH..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tax Code (MST) */}
      <div className="space-y-2">
        <Label htmlFor="merch-tax">Mã số thuế (MST)</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="merch-tax"
            placeholder="0301234567"
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="merch-email">Email liên hệ</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="merch-email"
            type="email"
            placeholder="lienhe@congty.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="merch-password">Mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="merch-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Ít nhất 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <PasswordStrengthBar password={password} />
      </div>

      {/* GPKD Upload Dropzone */}
      <div className="space-y-2">
        <Label>Giấy phép kinh doanh (GPKD)</Label>
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-all duration-200 cursor-pointer',
            isDragging
              ? 'border-primary-500 bg-primary-50 scale-[1.02]'
              : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50',
            file && 'border-secondary-400 bg-secondary-50'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="merch-gpkd"
          />

          {file ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200/60 text-gray-400">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">
                  Kéo thả hoặc <span className="text-primary-600">chọn file</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG (tối đa 5MB)</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" loading={isLoading}>
        Đăng ký đối tác
      </Button>
    </form>
  );
}
