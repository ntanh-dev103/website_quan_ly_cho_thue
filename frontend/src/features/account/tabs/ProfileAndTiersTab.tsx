import { useState } from 'react';
import { 
  UserCog, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  Crown
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { ProofCameraKYC } from '../components/ProofCameraKYC';
import { toast } from 'sonner';

export function ProfileAndTiersTab() {
  const { 
    user, 
    role, 
    tier, 
    customerTier, 
    merchantTier, 
    updateUser, 
    updateTier 
  } = useAuthStore();

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Nguyễn Quốc Duy');
  const [email, setEmail] = useState(user?.email || 'duy.nguyen@renthub.vn');
  const [phone, setPhone] = useState(user?.phone || '0912 345 678');
  const [address, setAddress] = useState(
    user?.address || 'Số 45, Đường Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  );
  const [companyName, setCompanyName] = useState(user?.companyName || 'DuyTech Media & Rental');
  const [taxCode, setTaxCode] = useState(user?.taxCode || '0318921832');
  const [isSaving, setIsSaving] = useState(false);

  // Stepper track view
  const [stepperView, setStepperView] = useState<'CUSTOMER' | 'MERCHANT'>('CUSTOMER');

  // Customer tiers definition
  const CUSTOMER_STEPS = [
    { key: 'C1', code: 'C1 Newbie', deposit: '40% Cọc', maxContracts: '2 HĐ', desc: 'Hạng mới đăng ký' },
    { key: 'C2', code: 'C2 Verified', deposit: '30% Cọc', maxContracts: '5 HĐ', desc: 'Đã xác thực CCCD' },
    { key: 'C3', code: 'C3 VIP', deposit: '15% Cọc', maxContracts: '10 HĐ', desc: 'Khách hàng thân thiết' },
    { key: 'C4', code: 'C4 Enterprise', deposit: '0% Miễn cọc', maxContracts: 'Vô hạn', desc: 'Bảo lãnh thanh toán Net-30' },
  ];

  // Merchant tiers definition
  const MERCHANT_STEPS = [
    { key: 'M1', code: 'M1 Starter', commission: '15% Hoa hồng', limit: '20 Sản phẩm', desc: 'Cửa hàng khởi nghiệp' },
    { key: 'M2', code: 'M2 Pro', commission: '10% Hoa hồng', limit: 'Không giới hạn', desc: 'Mở khóa Auto-Approve' },
    { key: 'M3', code: 'M3 Master', commission: '5% Hoa hồng', limit: 'Không giới hạn', desc: 'Ưu tiên hiển thị Top 1' },
    { key: 'M4', code: 'M4 Enterprise', commission: '2% Hoa hồng', limit: 'Không giới hạn', desc: 'Bộ công cụ B2B Team & API' },
  ];

  // Active customer / merchant index
  const activeCTier = tier.startsWith('C') ? tier : customerTier;
  const activeMTier = tier.startsWith('M') ? tier : merchantTier;

  const currentCIndex = CUSTOMER_STEPS.findIndex(s => s.key === activeCTier);
  const currentMIndex = MERCHANT_STEPS.findIndex(s => s.key === activeMTier);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      updateUser({
        name,
        email,
        phone,
        address,
        companyName,
        taxCode,
      });
      toast.success('Đã cập nhật thông tin hồ sơ thành công!');
    }, 600);
  };

  const handleSimulateM2Upgrade = () => {
    updateTier('M2');
    toast.success('Chúc mừng! Bạn đã hoàn thành 10/10 đơn hàng!', {
      description: 'Tài khoản của bạn đã được nâng cấp lên M2 Pro (Đối tác chuyên nghiệp).',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* TIER PROGRESSION CARD (Visual Gamification) */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Crown className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Hệ thống Cấp bậc & Quyền lợi Tuần hoàn (Gamification)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Thực hiện giao dịch uy tín để giảm tiền cọc và nâng cao hạn mức tài khoản
            </p>
          </div>

          {/* Stepper Track Switcher */}
          <div className="flex items-center p-1 bg-gray-100 rounded-lg shrink-0">
            <button
              onClick={() => setStepperView('CUSTOMER')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                stepperView === 'CUSTOMER'
                  ? 'bg-white text-primary-600 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hạng Khách hàng (C1 - C4)
            </button>
            <button
              onClick={() => setStepperView('MERCHANT')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                stepperView === 'MERCHANT'
                  ? 'bg-white text-violet-600 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hạng Đối tác (M1 - M4)
            </button>
          </div>
        </div>

        {/* Horizontal Stepper (Customer Track) */}
        {stepperView === 'CUSTOMER' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CUSTOMER_STEPS.map((step, idx) => {
                const isCurrent = step.key === activeCTier;
                const isPast = idx < currentCIndex;

                return (
                  <div
                    key={step.key}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20 shadow-xs'
                        : isPast
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-gray-200 bg-gray-50/60 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-primary-600 text-white shadow-xs'
                            : isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step.code}
                      </span>

                      {isPast ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600" />
                        </span>
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <p className="text-xs text-gray-600 font-medium">{step.desc}</p>

                    <div className="mt-3 pt-2 border-t border-gray-200/60 space-y-1 text-[11px]">
                      <div className="flex justify-between text-gray-500">
                        <span>Tiền cọc:</span>
                        <strong className="text-gray-900">{step.deposit}</strong>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Hạn mức:</span>
                        <strong className="text-gray-900">{step.maxContracts}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Tier Benefits */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-primary-800">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span>Quyền lợi cấp bậc tiếp theo (Next Tier Benefits):</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                  <span><strong>Giảm cọc xuống 15%</strong> (C3 VIP) hoặc <strong>Miễn 100% cọc</strong> (C4 Enterprise)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                  <span><strong>Tối đa 10 hợp đồng</strong> thuê đồng thời không cần xét duyệt bổ sung</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                  <span>Gói bảo hiểm thiết bị RentHub Care bảo vệ 100% va chạm rơi vỡ</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                  <span>Được quyền Cho thuê lại thiết bị (Circular Sub-renting) để tối ưu chi phí</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Horizontal Stepper (Merchant Track) */}
        {stepperView === 'MERCHANT' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {MERCHANT_STEPS.map((step, idx) => {
                const isCurrent = step.key === activeMTier;
                const isPast = idx < currentMIndex;

                return (
                  <div
                    key={step.key}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-violet-500 bg-violet-50/50 ring-2 ring-violet-500/20 shadow-xs'
                        : isPast
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-gray-200 bg-gray-50/60 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-violet-600 text-white shadow-xs'
                            : isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step.code}
                      </span>

                      {isPast ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600" />
                        </span>
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <p className="text-xs text-gray-600 font-medium">{step.desc}</p>

                    <div className="mt-3 pt-2 border-t border-gray-200/60 space-y-1 text-[11px]">
                      <div className="flex justify-between text-gray-500">
                        <span>Hoa hồng:</span>
                        <strong className="text-gray-900">{step.commission}</strong>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Kho hàng:</span>
                        <strong className="text-gray-900">{step.limit}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* KYC ACTION AREA */}
      <div className="space-y-4">
        {/* IF Current Tier is C1 -> Show "Xác minh danh tính (C2)" Action */}
        {activeCTier === 'C1' && (
          <ProofCameraKYC />
        )}

        {/* IF Current Tier is M1 -> Show "Nâng cấp lên Đối tác Pro (M2)" Action */}
        {activeMTier === 'M1' && (
          <div className="bg-white rounded-xl border border-amber-200/80 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Nâng cấp lên Đối tác Pro (M2 Pro)
                </h4>
                <p className="text-xs text-gray-500">
                  Điều kiện: Hoàn thành 10 đơn hàng thành công và đạt đánh giá từ 4.8 sao
                </p>
              </div>

              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                Tiến độ: 3/10 đơn (30%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span>3 đơn hoàn thành</span>
                <span>Mục tiêu 10 đơn</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: '30%' }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500 italic">
                Cần thêm 7 đơn hàng để tự động nâng hạng M2 Pro.
              </p>

              <Button
                size="sm"
                onClick={handleSimulateM2Upgrade}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                Mở khóa M2 Pro (Demo Upgrade)
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* PROFILE FORM: Edit Name, Phone, Email, Address */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                Thông tin Hồ sơ Cá nhân & Doanh nghiệp
              </h3>
              <p className="text-xs text-gray-500">
                Cập nhật thông tin nhận thông báo, địa chỉ giao hàng và mã số thuế
              </p>
            </div>
          </div>

          <TierBadge role={role} tier={tier} size="md" />
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Họ và tên (*)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Số điện thoại (*)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Email (*)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Tên Doanh nghiệp / Cửa hàng (nếu có)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Địa chỉ giao nhận mặc định (*)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Mã số thuế doanh nghiệp
              </label>
              <input
                type="text"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                placeholder="0301234567"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-gray-100">
            <Button
              type="submit"
              loading={isSaving}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-5 rounded-lg"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Lưu thay đổi hồ sơ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
