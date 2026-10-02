import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  Zap, 
  FileCheck2, 
  Calculator, 
  Plus, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { mockProducts } from '@/entities/product/product.mock';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { formatCurrency } from '@/shared/lib/utils';
import type { CustomerTier } from '@/entities/user/user.types';

interface HeroSectionProps {
  onStartRental?: () => void;
}

const TIER_DEPOSIT_MAP: Record<CustomerTier, { label: string; rate: number; badge: string }> = {
  C1: { label: 'Hạng C1 (Cơ bản)', rate: 0.40, badge: 'Cọc 40%' },
  C2: { label: 'Hạng C2 (Bạc)', rate: 0.30, badge: 'Cọc 30%' },
  C3: { label: 'Hạng C3 (Vàng)', rate: 0.15, badge: 'Cọc 15%' },
  C4: { label: 'Hạng C4 (Kim Cương)', rate: 0.00, badge: 'Miễn cọc 0%' },
};

export function HeroSection({ onStartRental }: HeroSectionProps) {
  const { addItem, setIsOpen } = useGhostCartStore();
  const { tier: userTier } = useAuthStore();

  // Quick estimator state
  const sampleProducts = [mockProducts[1], mockProducts[0], mockProducts[3]]; // Sony A7 IV, VinFast VF8, Lều Glamping
  const [selectedProductId, setSelectedProductId] = useState(sampleProducts[0]?.id || 'prod-2');
  const [rentalDays, setRentalDays] = useState(3);
  const validCustomerTiers: CustomerTier[] = ['C1', 'C2', 'C3', 'C4'];
  const [selectedTier, setSelectedTier] = useState<CustomerTier>(
    validCustomerTiers.includes(userTier as CustomerTier) ? (userTier as CustomerTier) : 'C1'
  );

  const currentProduct = sampleProducts.find((p) => p.id === selectedProductId) || sampleProducts[0];
  const depositRate = TIER_DEPOSIT_MAP[selectedTier]?.rate ?? 0.40;
  const rentalFee = currentProduct.pricePerDay * rentalDays;
  const calculatedDeposit = currentProduct.depositAmount * depositRate;
  const estimatedTotal = rentalFee + calculatedDeposit;

  const handleScrollToKits = () => {
    if (onStartRental) {
      onStartRental();
    } else {
      const el = document.getElementById('curated-kits-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAddEstimatedItem = () => {
    addItem(currentProduct, rentalDays);
    setIsOpen(true);
  };

  return (
    <section className="relative w-full border-b border-gray-200/80 bg-white py-12 md:py-16 lg:py-20 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Two-column layout: Left typography & CTAs, Right Live Estimator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Modern Minimalist Statement */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Nền tảng Cho thuê & Đảm bảo Hợp đồng</span>
            </div>

            {/* Headline H1 (Solid ink, tight tracking, no gradient) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-gray-950 leading-[1.14] mb-5">
              Thuê thiết bị chuyên nghiệp.
              <span className="block text-primary-600 mt-1">
                Tối ưu chi phí, miễn cọc tới 100%.
              </span>
            </h1>

            {/* Lede Description */}
            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-xl mb-8">
              Tiếp cận hơn 1.200 máy ảnh, flycam, đồ dã ngoại và phương tiện chính hãng từ các đối tác đã qua kiểm định danh tính. Cơ chế phân tầng tín nhiệm độc quyền giúp khách thuê uy tín hoàn toàn không cần đặt cọc.
            </p>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
              <Button
                type="button"
                size="lg"
                onClick={handleScrollToKits}
                className="h-12 px-7 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-sm transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <span>Khám phá đồ thuê</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Link to="/partner" className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 rounded-xl border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-semibold transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span>Trở thành Đối tác</span>
                </Button>
              </Link>
            </div>

            {/* Trust Proof Bar */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Xác thực 100%</h4>
                  <p className="text-[11px] text-gray-500">Đối tác M1–M4 duyệt CCCD/GPKD</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Miễn cọc 0%</h4>
                  <p className="text-[11px] text-gray-500">Áp dụng cho thành viên Hạng C4</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <FileCheck2 className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Hợp đồng điện tử</h4>
                  <p className="text-[11px] text-gray-500">Ký duyệt online, giao máy trong 2h</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Live Estimator (Telemetry & Core Business Logic) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-gray-200/90 bg-[#F8FAFC] p-5 sm:p-6 shadow-sm">
              
              {/* Estimator Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/80 mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <Calculator className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Ước tính giá thuê & Tiền cọc
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Tính toán thời gian thực theo Tier khách hàng
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Trực quan
                </span>
              </div>

              {/* Step 1: Chọn thiết bị */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>Thiết bị mẫu:</span>
                  <span className="text-[11px] font-normal text-gray-500">
                    {formatCurrency(currentProduct.pricePerDay)}/ngày
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {sampleProducts.map((p) => {
                    const isSelected = p.id === selectedProductId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProductId(p.id)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all ${
                          isSelected
                            ? 'bg-white border-primary-600 ring-2 ring-primary-100 font-bold text-primary-900 shadow-2xs'
                            : 'bg-white/70 border-gray-200 hover:bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="line-clamp-1">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate">{p.merchant?.name || p.city}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Chọn số ngày thuê */}
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>Thời gian thuê:</span>
                  <span className="text-xs font-bold text-primary-600">{rentalDays} ngày</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 7, 14].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRentalDays(d)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        rentalDays === d
                          ? 'bg-primary-600 text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {d} ngày
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Chọn Tier của tài khoản */}
              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                  <span>Hạng tín nhiệm của bạn:</span>
                  <span className="text-[11px] text-gray-500">Xem mức giảm cọc</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['C1', 'C2', 'C3', 'C4'] as CustomerTier[]).map((tierKey) => {
                    const info = TIER_DEPOSIT_MAP[tierKey];
                    const isSelected = selectedTier === tierKey;
                    return (
                      <button
                        key={tierKey}
                        type="button"
                        onClick={() => setSelectedTier(tierKey)}
                        className={`p-2 rounded-xl text-center border text-xs transition-all ${
                          isSelected
                            ? 'bg-white border-primary-600 ring-2 ring-primary-100 font-bold text-gray-900 shadow-2xs'
                            : 'bg-white/60 border-gray-200 hover:bg-white text-gray-600'
                        }`}
                      >
                        <div className="font-extrabold">{tierKey}</div>
                        <div className={`text-[10px] mt-0.5 ${tierKey === 'C4' ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                          {info.badge}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Breakdown Summary */}
              <div className="rounded-xl bg-white border border-gray-200/80 p-3.5 space-y-2 mb-4">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Giá thuê ({rentalDays} ngày):</span>
                  <span className="font-semibold text-gray-900 tabular-nums">
                    {formatCurrency(rentalFee)}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-600 items-center">
                  <span>Tiền cọc ({TIER_DEPOSIT_MAP[selectedTier]?.badge ?? 'Cọc 40%'}):</span>
                  {selectedTier === 'C4' ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 tabular-nums">
                      <Sparkles className="h-3 w-3" />
                      0đ (Miễn cọc)
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {formatCurrency(calculatedDeposit)}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-gray-900">Tổng thanh toán tạm tính:</span>
                  <span className="text-base font-extrabold text-primary-600 tabular-nums">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
              </div>

              {/* Quick action button */}
              <button
                type="button"
                onClick={handleAddEstimatedItem}
                className="w-full h-11 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm món này vào giỏ thuê</span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
