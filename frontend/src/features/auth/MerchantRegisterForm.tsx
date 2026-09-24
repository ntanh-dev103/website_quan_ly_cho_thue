import { useState, useCallback, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Building2, FileText, Upload, X, User, Phone, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { PasswordStrengthBar } from './PasswordStrengthBar';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { cn } from '@/shared/lib/utils';

type PartnerTier = 'b2b' | 'individual';

export function MerchantRegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [partnerTier, setPartnerTier] = useState<PartnerTier>('b2b');

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Individual fields
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceCategory, setDeviceCategory] = useState('');

  // B2B fields
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag & Drop handlers for B2B GPKD
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

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (partnerTier === 'individual') {
      if (!ownerName || !phone || !email || !password) {
        toast.error('Vui lòng điền đầy đủ thông tin đối tác cá nhân');
        return;
      }

      try {
        await register(
          {
            companyName: `Shop ${ownerName}`,
            taxCode: 'CANHAN',
            email,
            password,
          },
          'MERCHANT'
        );
        toast.success('Đăng ký Đối tác Cá nhân thành công! Chào mừng bạn gia nhập sàn.');
        navigate('/merchant');
      } catch {
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } else {
      // B2B Enterprise
      if (!companyName || !taxCode || !email || !password) {
        toast.error('Vui lòng điền đầy đủ thông tin doanh nghiệp B2B');
        return;
      }

      try {
        await register(
          {
            companyName,
            taxCode,
            email,
            password,
            businessLicense: file ?? undefined,
          },
          'MERCHANT'
        );
        toast.success('Nộp hồ sơ Đối tác B2B thành công! Hồ sơ đang được chuyên viên duyệt.');
        navigate('/merchant');
      } catch {
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1 mb-4 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
          Kênh đối tác cho thuê
        </h2>
        <p className="text-xs text-[#64748B]">
          Đăng ký để tiếp cận hàng triệu khách thuê trên toàn quốc.
        </p>
      </div>

      {/* 2-Tier Selector: Đối tác B2B vs Đối tác Cá nhân */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F1F5F9] rounded-2xl border border-[#D7E5F0]">
        <button
          type="button"
          onClick={() => setPartnerTier('b2b')}
          className={cn(
            'flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 cursor-pointer text-center',
            partnerTier === 'b2b'
              ? 'bg-white text-[#8B5CF6] shadow-sm font-bold border border-[#D7E5F0]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          )}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Building2 className="h-4 w-4 text-[#8B5CF6]" />
            <span>Đối tác B2B</span>
          </div>
          <span className="text-[10px] text-[#64748B] mt-0.5">Doanh nghiệp · Phí sàn 2%</span>
        </button>

        <button
          type="button"
          onClick={() => setPartnerTier('individual')}
          className={cn(
            'flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-200 cursor-pointer text-center',
            partnerTier === 'individual'
              ? 'bg-white text-[#2563EB] shadow-sm font-bold border border-[#D7E5F0]'
              : 'text-[#64748B] hover:text-[#0F172A]'
          )}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <User className="h-4 w-4 text-[#2563EB]" />
            <span>Đối tác Cá nhân</span>
          </div>
          <span className="text-[10px] text-[#64748B] mt-0.5">Shop nhỏ / Freelancer</span>
        </button>
      </div>

      {/* Perks Callout based on Tier */}
      {partnerTier === 'b2b' ? (
        <div className="rounded-xl p-3 bg-purple-50 border border-purple-200 text-purple-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-purple-800">
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
            <span>Đặc quyền Đối tác B2B Doanh nghiệp:</span>
          </div>
          <p className="text-[11px] text-purple-700 leading-relaxed pl-5">
            Hoa hồng sàn ưu đãi chỉ 2%, xuất hóa đơn VAT điện tử, quản lý kho số lượng lớn và tiếp cận hàng ngàn khách thuê doanh nghiệp.
          </p>
        </div>
      ) : (
        <div className="rounded-xl p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-800">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span>Quyền lợi Đối tác Cá nhân:</span>
          </div>
          <p className="text-[11px] text-blue-700 leading-relaxed pl-5">
            Thủ tục xét duyệt tức thì trong 5 phút. Tận dụng phương tiện, trang phục, máy ảnh nhàn rỗi để tạo nguồn thu nhập thụ động bền vững.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {partnerTier === 'b2b' ? (
          <>
            {/* Company Name */}
            <div className="space-y-1.5">
              <Label htmlFor="merch-company" className="text-xs font-semibold text-[#0F172A]">
                Tên công ty / Doanh nghiệp
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  id="merch-company"
                  placeholder="Công ty Cổ phần / TNHH..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 rounded-xl"
                />
              </div>
            </div>

            {/* Tax Code */}
            <div className="space-y-1.5">
              <Label htmlFor="merch-tax" className="text-xs font-semibold text-[#0F172A]">
                Mã số thuế (MST)
              </Label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  id="merch-tax"
                  placeholder="0301234567"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="pl-10 h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 rounded-xl"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Individual Name */}
            <div className="space-y-1.5">
              <Label htmlFor="indiv-name" className="text-xs font-semibold text-[#0F172A]">
                Họ tên chủ thiết bị / Tên shop
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  id="indiv-name"
                  placeholder="Nguyễn Văn A (hoặc Shop Camera Pro)"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="pl-10 h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-xl"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="indiv-phone" className="text-xs font-semibold text-[#0F172A]">
                Số điện thoại liên hệ / Zalo
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                <Input
                  id="indiv-phone"
                  placeholder="0912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-xl"
                />
              </div>
            </div>

            {/* Equipment types */}
            <div className="space-y-1.5">
              <Label htmlFor="indiv-cat" className="text-xs font-semibold text-[#0F172A]">
                Ngành hàng bạn muốn cho thuê
              </Label>
              <Input
                id="indiv-cat"
                placeholder="Ví dụ: Phương tiện, Thời trang sự kiện, Máy ảnh..."
                value={deviceCategory}
                onChange={(e) => setDeviceCategory(e.target.value)}
                className="h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-xl px-3"
              />
            </div>
          </>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="merch-email" className="text-xs font-semibold text-[#0F172A]">
            Email đăng ký
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              id="merch-email"
              type="email"
              placeholder={partnerTier === 'b2b' ? 'doanhnghiep@congty.com' : 'email@canhan.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="merch-password" className="text-xs font-semibold text-[#0F172A]">
            Mật khẩu quản trị gian hàng
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              id="merch-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-10 bg-white border-[#D7E5F0] text-[#0F172A] placeholder:text-slate-400 focus:border-[#06B6D4] focus:ring-[#06B6D4]/20 rounded-xl"
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

        {/* GPKD Dropzone (Only for B2B) */}
        {partnerTier === 'b2b' && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#0F172A]">Giấy phép ĐKKD (GPKD - Tùy chọn)</Label>
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed p-4 transition-all duration-200 cursor-pointer',
                isDragging
                  ? 'border-[#8B5CF6] bg-purple-50'
                  : 'border-[#D7E5F0] bg-[#F8FAFC] hover:border-[#8B5CF6]/50',
                file && 'border-[#8B5CF6] bg-purple-50'
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
                <div className="flex items-center gap-2.5 w-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-[#8B5CF6]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0F172A] truncate">{file.name}</p>
                    <p className="text-[10px] text-[#64748B]">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 rounded hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-center text-xs text-[#64748B]">
                  <Upload className="h-4 w-4 text-[#8B5CF6]" />
                  <span>Tải ảnh GPKD (JPG, PNG tối đa 5MB)</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <Button 
          type="submit" 
          className="w-full h-11 font-bold text-base bg-gradient-to-r from-[#8B5CF6] to-[#2563EB] hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/20 rounded-xl mt-2 cursor-pointer border-0" 
          size="lg" 
          loading={isLoading}
        >
          {partnerTier === 'b2b' ? 'Đăng ký đối tác Doanh nghiệp B2B' : 'Đăng ký đối tác Cá nhân'}
        </Button>
      </form>

      {/* Navigation Links */}
      <div className="pt-2 border-t border-[#D7E5F0] flex items-center justify-between text-xs">
        <Link 
          to="/register" 
          className="text-[#64748B] hover:text-[#0F172A] inline-flex items-center gap-1 transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Đăng ký khách hàng</span>
        </Link>

        <Link 
          to="/login" 
          className="font-bold text-[#06B6D4] hover:text-[#2563EB] inline-flex items-center gap-1 transition-colors"
        >
          <span>Đã có tài khoản? Đăng nhập</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
