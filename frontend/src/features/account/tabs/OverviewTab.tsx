import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  ShoppingCart, 
  Store, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Package,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { formatCurrency } from '@/shared/lib/utils';
import { mockActiveRentals, mockIncomingOrders } from '../account.mock';
import type { IncomingOrder } from '../account.types';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useContractStore } from '@/entities/contract/useContractStore';
import { toast } from 'sonner';

interface OverviewTabProps {
  onSelectTab: (tabId: string) => void;
  onOpenRelistModal: () => void;
}

export function OverviewTab({ onSelectTab, onOpenRelistModal }: OverviewTabProps) {
  const navigate = useNavigate();
  const { 
    role, 
    tier, 
    customerTier, 
    merchantTier, 
    hasRole, 
    getDepositRate, 
    getCommissionRate 
  } = useAuthStore();

  const isCustomer = hasRole('CUSTOMER');
  const isMerchant = hasRole('MERCHANT');
  const isDualRole = isCustomer && isMerchant;
  const isAdmin = role === 'ADMIN';

  const activeCTier = tier.startsWith('C') ? tier : customerTier;
  const activeMTier = tier.startsWith('M') ? tier : merchantTier;
  const depositRate = Math.round(getDepositRate() * 100);
  const commissionRate = Math.round(getCommissionRate() * 100);

  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>(mockIncomingOrders);
  const { contracts } = useContractStore();
  const activeContracts = contracts.filter((c) => c.status === 'ACTIVE' || c.status === 'RENTING');

  // Earning / Spending calculations
  const totalEarned = 12000000;
  const totalSpent = 7500000;
  const netBalance = totalEarned - totalSpent; // + 4.500.000đ
  const isPositive = netBalance >= 0;

  const handleQuickApprove = (orderId: string, orderCode: string) => {
    setIncomingOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, status: 'APPROVED' } : ord)
    );
    toast.success(`Đã xác nhận đơn hàng ${orderCode}!`, {
      description: 'Đơn hàng đã được chuyển sang trạng thái "Đang chuẩn bị hàng".',
    });
  };

  const handleQuickReject = (orderId: string, orderCode: string) => {
    setIncomingOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, status: 'REJECTED' } : ord)
    );
    toast.info(`Đã từ chối đơn hàng ${orderCode}.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* =========================================================================
          HERO METRIC BANNER (Role-Tailored)
         ========================================================================= */}

      {/* 1. ADMIN HERO */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-900 via-gray-900 to-red-950 text-white rounded-xl shadow-md p-6 relative overflow-hidden border border-red-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                  Trung tâm Quản trị Hệ thống
                </span>
                <span className="inline-flex items-center gap-1 bg-red-800 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <ShieldAlert className="h-3 w-3" /> Admin Superuser
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Toàn quyền kiểm soát Sàn RentHub
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Quản lý người dùng, xét duyệt shop đối tác, kiểm soát danh mục và chính sách hoa hồng.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={() => navigate('/admin')}
                className="bg-red-600 hover:bg-red-700 text-white shadow-md font-bold text-xs py-5 px-5 rounded-xl gap-2"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Mở Cổng Quản Trị /admin →</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DUAL ROLE HERO: Circular Economy (Net Balance) */}
      {!isAdmin && isDualRole && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Số dư ròng (Net Balance)
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  <TrendingUp className="h-3 w-3" /> Hội viên Tuần hoàn Kép
                </span>
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="text-[11px] text-gray-400 font-medium">Hạng:</span>
                  <TierBadge role="CUSTOMER" tier={activeCTier} size="sm" variant="code" />
                  <TierBadge role="MERCHANT" tier={activeMTier} size="sm" variant="code" />
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <h2
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}
                >
                  {isPositive ? '+ ' : ''}{formatCurrency(netBalance)}
                </h2>
              </div>

              <p className="text-sm text-gray-600 font-medium">
                Kiếm ra: <span className="font-semibold text-emerald-600">{formatCurrency(totalEarned)}</span> | Chi đi: <span className="font-semibold text-red-500">{formatCurrency(totalSpent)}</span>
              </p>

              {/* Circular Ratio Bar */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1">
                  <span>Thu nhập từ Cho thuê (61.5%)</span>
                  <span>Chi phí Đi thuê (38.5%)</span>
                </div>
                <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '61.5%' }} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                onClick={onOpenRelistModal}
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 py-5 px-5 rounded-xl font-bold gap-2 text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>🔄 Chuyển đồ thuê</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => onSelectTab('wallet')}
                className="border-gray-200 hover:bg-gray-50 py-5 px-4 rounded-xl font-semibold text-xs gap-1.5"
              >
                <span>Xem sổ cái</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PURE CUSTOMER HERO */}
      {!isAdmin && isCustomer && !isMerchant && (
        <div className="bg-white rounded-xl shadow-xs border border-blue-200/80 p-6 relative overflow-hidden bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Tổng quan Tài khoản Khách thuê
                </span>
                <TierBadge role="CUSTOMER" tier={activeCTier} size="sm" variant="code" />
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
                  3 Thiết bị đang thuê
                </h2>
              </div>

              <p className="text-sm text-gray-600 font-medium">
                Tổng chi phí thuê tháng: <span className="font-bold text-gray-900">{formatCurrency(totalSpent)}</span>
                <span className="mx-2 text-gray-300">•</span>
                Tỷ lệ ký quỹ áp dụng: <span className="font-extrabold text-blue-600">{depositRate}% giá trị máy</span>
              </p>

              {/* Dynamic Tier Perk Guide */}
              <div className="pt-1">
                {activeCTier === 'C1' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <span>🔹 Hạng <strong>C1 Newbie</strong> (40% cọc). Hãy xác thực danh tính để giảm cọc xuống 30%!</span>
                    <button
                      onClick={() => onSelectTab('profile')}
                      className="font-bold text-primary-700 underline hover:text-primary-800 shrink-0"
                    >
                      Xác thực KYC ngay →
                    </button>
                  </div>
                )}
                {activeCTier === 'C2' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hạng <strong>C2 Verified</strong>: Đã xác thực CCCD. Bạn đang hưởng mức ký quỹ ưu đãi 30%.</span>
                  </div>
                )}
                {activeCTier === 'C3' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hạng <strong>C3 VIP</strong>: Khách hàng thân thiết. Mức cọc được giảm sâu xuống chỉ còn <strong>15%</strong>!</span>
                  </div>
                )}
                {activeCTier === 'C4' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Đặc quyền <strong>C4 Kim Cương</strong>: <strong>Miễn 100% tiền cọc (0% Deposit)</strong> với bảo lãnh tín nhiệm!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                onClick={() => navigate('/catalog')}
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20 py-5 px-5 rounded-xl font-bold gap-2 text-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Thuê thêm thiết bị</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => onSelectTab('renting-in')}
                className="border-gray-200 hover:bg-gray-50 py-5 px-4 rounded-xl font-semibold text-xs gap-1.5"
              >
                <span>Hợp đồng của tôi</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PURE MERCHANT HERO */}
      {!isAdmin && isMerchant && !isCustomer && (
        <div className="bg-white rounded-xl shadow-xs border border-purple-200/80 p-6 relative overflow-hidden bg-gradient-to-r from-purple-50/40 via-white to-pink-50/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Tổng quan Kênh Đối tác Cho thuê
                </span>
                <TierBadge role="MERCHANT" tier={activeMTier} size="sm" variant="code" />
              </div>

              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600">
                  + {formatCurrency(totalEarned)}
                </h2>
                <span className="text-xs font-bold text-gray-500">Doanh thu tháng này</span>
              </div>

              <p className="text-sm text-gray-600 font-medium">
                Chờ xác nhận: <span className="font-bold text-amber-600">3 đơn đặt mới</span>
                <span className="mx-2 text-gray-300">•</span>
                Phí hoa hồng sàn: <span className="font-extrabold text-purple-600">{commissionRate}%</span>
              </p>

              <div className="pt-1">
                {activeMTier === 'M1' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    <span>🔹 Hạng <strong>M1 Starter</strong> (Kho giới hạn 20 SP, phí 15%). Cần thêm 7 đơn để nâng hạng <strong>M2 Pro</strong>!</span>
                    <button
                      onClick={() => onSelectTab('profile')}
                      className="font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
                    >
                      Xem tiến độ nâng cấp →
                    </button>
                  </div>
                )}
                {activeMTier === 'M2' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hạng <strong>M2 Pro</strong>: Đã mở khóa tính năng Duyệt tự động Auto-Approve và kho không giới hạn.</span>
                  </div>
                )}
                {activeMTier === 'M3' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Hạng <strong>M3 Master</strong>: Ưu tiên hiển thị Top 1 sàn RentHub, hoa hồng chỉ <strong>5%</strong>.</span>
                  </div>
                )}
                {activeMTier === 'M4' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-xs text-violet-900 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    <span>Hạng <strong>M4 Enterprise</strong>: Bộ công cụ B2B quản trị nhóm, hóa đơn VAT & API, hoa hồng chỉ <strong>2%</strong>!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                onClick={() => onSelectTab('renting-out')}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 py-5 px-5 rounded-xl font-bold gap-2 text-sm"
              >
                <Store className="h-4 w-4" />
                <span>Xử lý đơn cho thuê</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/merchant')}
                className="border-gray-200 hover:bg-gray-50 py-5 px-4 rounded-xl font-semibold text-xs gap-1.5"
              >
                <span>Vào Kênh Đối tác</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* =========================================================================
          MEMBERSHIP TIERS & PRIVILEGES SUMMARY (Hiển thị Hạng Thành viên & Đặc quyền)
         ========================================================================= */}
      {!isAdmin && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>Hạng Thành viên & Đặc quyền Tài khoản</span>
                  {isDualRole && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🔄 Hội viên Tuần hoàn Kép
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-500">
                  Chính sách ký quỹ, hoa hồng sàn và hạn mức hợp đồng theo cấp bậc thực tế
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTab('profile')}
              className="text-xs font-bold border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0 gap-1 cursor-pointer"
            >
              <span>Xem Stepper Cấp bậc & KYC</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* GRID OF TIERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CARD 1: HẠNG KHÁCH ĐI THUÊ */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20 border border-blue-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">1. Hạng Khách Đi Thuê:</span>
                <TierBadge role="CUSTOMER" tier={activeCTier} size="sm" variant="code" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-blue-100 shadow-2xs">
                  <span className="text-[11px] text-gray-500 block">Tỷ lệ Ký quỹ (Tiền cọc)</span>
                  <span className="text-sm font-extrabold text-blue-700">{depositRate}% giá trị máy</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-blue-100 shadow-2xs">
                  <span className="text-[11px] text-gray-500 block">Hạn mức HĐ cùng lúc</span>
                  <span className="text-sm font-extrabold text-gray-900">
                    {activeCTier === 'C1' ? '2 hợp đồng' : activeCTier === 'C2' ? '5 hợp đồng' : activeCTier === 'C3' ? '10 hợp đồng' : 'Không giới hạn'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-blue-800 pt-1">
                <span>🛡️ Tiền cọc phong tỏa tại Escrow RentHub</span>
                {activeCTier !== 'C4' && (
                  <button
                    onClick={() => onSelectTab('profile')}
                    className="font-bold underline hover:text-blue-950 cursor-pointer"
                  >
                    Nâng lên {activeCTier === 'C1' ? 'C2 (30% cọc)' : activeCTier === 'C2' ? 'C3 (15% cọc)' : 'C4 (0% cọc)'} →
                  </button>
                )}
              </div>
            </div>

            {/* CARD 2: HẠNG CHO THUÊ RA (CÁ NHÂN / MERCHANT) */}
            {isMerchant ? (
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/20 border border-emerald-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">2. Hạng Kênh Cho Thuê:</span>
                  <TierBadge role="MERCHANT" tier={activeMTier} size="sm" variant="code" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                    <span className="text-[11px] text-gray-500 block">Phí hoa hồng sàn</span>
                    <span className="text-sm font-extrabold text-emerald-700">{commissionRate}% doanh thu</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                    <span className="text-[11px] text-gray-500 block">Dung lượng kho đăng</span>
                    <span className="text-sm font-extrabold text-gray-900">
                      {activeMTier === 'M1' ? '20 sản phẩm' : 'Không giới hạn'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-800 pt-1">
                  <span>⚡ Bảo hiểm RentGuard bồi hoàn 100%</span>
                  {activeMTier === 'M1' && (
                    <button
                      onClick={() => onSelectTab('profile')}
                      className="font-bold underline hover:text-emerald-950 cursor-pointer"
                    >
                      Nâng lên M2 Pro (10% phí) →
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-emerald-50/30 border border-dashed border-gray-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-gray-700">2. Kênh Cá Nhân Cho Thuê:</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Chưa kích hoạt
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Bật tính năng Cho thuê Cá nhân để mở khóa hạng M1 Starter, tạo thu nhập từ thiết bị nhàn rỗi.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => onSelectTab('activate-renting-out')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 rounded-lg shadow-xs gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Kích hoạt Cá nhân Cho thuê (M1)</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN 2-COLUMN GRID (Role-Filtered)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* =====================================================================
            COLUMN 1: CUSTOMER VIEW (Đang thuê VÀO)
            Visible for CUSTOMER and DUAL ROLE
           ===================================================================== */}
        {(isCustomer || isAdmin) && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Đang thuê VÀO (Customer)
                    </h3>
                    <p className="text-[11px] text-gray-500">Thiết bị bạn đang sử dụng</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab('renting-in')}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* List of recent Active Contracts */}
              <div className="space-y-3">
                {activeContracts.length > 0 ? (
                  activeContracts.slice(0, 3).map((contract) => {
                    const remainingMs = new Date(contract.endDate).getTime() - Date.now();
                    const remainingDays = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60 * 24)));
                    const remainingHours = Math.max(0, Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

                    return (
                      <div
                        key={contract.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-all"
                      >
                        <img
                          src={contract.product.imageUrl || contract.product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'}
                          alt={contract.product.name}
                          className="h-14 w-14 rounded-lg object-cover bg-white shrink-0 shadow-2xs border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {contract.product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-gray-500 font-mono">
                              {contract.contractCode}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {formatCurrency(contract.product.pricePerDay)}/ngày
                            </span>
                          </div>
                          {/* Countdown */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-amber-700">
                            <Clock className="h-3 w-3" />
                            <span>Còn {remainingDays} ngày {remainingHours} giờ</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectTab('renting-in')}
                          className="shrink-0 text-xs rounded-lg border-gray-200 h-8 px-2.5 font-semibold"
                        >
                          Chi tiết
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  mockActiveRentals.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-all"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-14 w-14 rounded-lg object-cover bg-white shrink-0 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-semibold text-gray-500">
                            {item.contractCode}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {formatCurrency(item.dailyRate)}/ngày
                          </span>
                        </div>
                        {/* Countdown */}
                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-amber-700">
                          <Clock className="h-3 w-3" />
                          <span>Còn {item.remainingDays} ngày {item.remainingHours} giờ</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectTab('renting-in')}
                        className="shrink-0 text-xs rounded-lg border-gray-200 h-8 px-2.5"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Tổng cộng: <strong>{activeContracts.length > 0 ? activeContracts.length : 3} hợp đồng đang chạy</strong></span>
              <button
                onClick={() => onSelectTab('renting-in')}
                className="text-primary-600 font-semibold hover:underline"
              >
                Yêu cầu trả hàng & hoàn cọc →
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            COLUMN 2A: PURE CUSTOMER RIGHT CARD (Privileges & Income Opportunity)
            Rendered ONLY when user is purely CUSTOMER (Not Merchant)
           ===================================================================== */}
        {!isAdmin && isCustomer && !isMerchant && (
          <div className="space-y-6 flex flex-col justify-between">
            {/* Tier Privileges Summary */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Đặc quyền Hạng Thành viên</h4>
                    <p className="text-[11px] text-gray-500">Chính sách ký quỹ & hạn mức hợp đồng</p>
                  </div>
                </div>
                <TierBadge role="CUSTOMER" tier={activeCTier} size="sm" variant="code" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[11px] block">Mức ký quỹ (Tiền cọc)</span>
                  <span className="text-base font-extrabold text-blue-600">{depositRate}%</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Giá trị thiết bị</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[11px] block">Cọc giữ tại Escrow</span>
                  <span className="text-base font-extrabold text-emerald-600">8.500.000 đ</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Bảo lãnh 100% an toàn</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>Bảo vệ quyền lợi khách thuê:</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Tiền cọc của bạn được phong tỏa tại tài khoản ký quỹ trung gian Escrow của RentHub và chỉ thanh toán cho đối tác sau khi bàn giao nghiệm thu hoàn tất.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectTab('profile')}
                className="w-full text-xs font-bold border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Xem chi tiết Stepper Cấp bậc & KYC →
              </Button>
            </div>

            {/* Circular Economy Invitation Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-xs p-5 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-white/20 px-2 py-0.5 rounded-full inline-block">
                  Cơ hội gia tăng thu nhập
                </span>
                <h4 className="text-base font-extrabold leading-snug">
                  Bạn có thiết bị công nghệ hoặc xe cộ nhàn rỗi?
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Trở thành Đối tác Cho thuê trên RentHub để biến tài sản tĩnh thành dòng tiền thụ động, cùng mở rộng nền kinh tế tuần hoàn.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => onSelectTab('activate-renting-out')}
                    size="sm"
                    className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-sm gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Bật Cá nhân Cho thuê ngay</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/partner')}
                    size="sm"
                    className="border-white/30 text-white hover:bg-white/10 font-medium text-xs cursor-pointer gap-1"
                  >
                    <span>Cổng Doanh nghiệp</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            COLUMN 2B: MERCHANT VIEW (Cho thuê RA)
            Visible for MERCHANT and DUAL ROLE
           ===================================================================== */}
        {(isMerchant || isAdmin) && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Store className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Cho thuê RA (Merchant)
                    </h3>
                    <p className="text-[11px] text-gray-500">Đơn hàng mới cần xác nhận</p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab('renting-out')}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <span>Xem tất cả đơn đến</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* List of 3 recent PENDING_CONFIRMATION contracts */}
              <div className="space-y-3">
                {incomingOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={order.customerAvatar}
                          alt={order.customerName}
                          className="h-6 w-6 rounded-full object-cover shrink-0"
                        />
                        <span className="text-xs font-bold text-gray-800 truncate">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">
                          {order.customerTier}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">
                        {order.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="h-12 w-12 rounded-lg object-cover bg-white shrink-0 shadow-2xs"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-gray-900 truncate">
                          {order.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-gray-500 text-[11px]">
                          <span>Thuê {order.rentalDays} ngày</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">
                            {formatCurrency(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Quick action buttons */}
                      {order.status === 'PENDING_CONFIRMATION' ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleQuickApprove(order.id, order.contractCode)}
                            className="bg-primary-600 hover:bg-primary-700 text-white h-7 text-[11px] px-2.5 rounded-lg"
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleQuickReject(order.id, order.contractCode)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-[11px] px-2 rounded-lg"
                          >
                            Từ chối
                          </Button>
                        </div>
                      ) : (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          order.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.status === 'APPROVED' ? 'Đã duyệt' : 'Đã từ chối'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Chờ xử lý: <strong className="text-amber-600">3 đơn đặt mới</strong></span>
              <button
                onClick={() => onSelectTab('renting-out')}
                className="text-primary-600 font-semibold hover:underline"
              >
                Quản lý toàn bộ kho & đơn hàng →
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            COLUMN 2C: PURE MERCHANT RIGHT CARD (Inventory & Store Health)
            Rendered ONLY when user is purely MERCHANT (Not Customer)
           ===================================================================== */}
        {!isAdmin && isMerchant && !isCustomer && (
          <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Chỉ số Hiệu suất Shop</h4>
                    <p className="text-[11px] text-gray-500">Tình trạng kho hàng & xếp hạng cửa hàng</p>
                  </div>
                </div>
                <TierBadge role="MERCHANT" tier={activeMTier} size="sm" variant="code" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[11px] block">Dung lượng kho</span>
                  <span className="text-base font-extrabold text-purple-700">
                    {activeMTier === 'M1' ? '18 / 20 SP' : '52 / Vô hạn'}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {activeMTier === 'M1' ? 'Cần nâng cấp M2 để mở rộng' : 'Kho hàng không giới hạn'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-gray-500 text-[11px] block">Tỷ lệ duyệt đơn</span>
                  <span className="text-base font-extrabold text-emerald-600">98.5%</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Phản hồi dưới 15 phút</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Đánh giá uy tín shop:
                  </span>
                  <span className="text-amber-600 font-extrabold">4.9 / 5.0 ⭐</span>
                </div>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  Cửa hàng của bạn đạt tiêu chuẩn <strong>Đối tác Xuất sắc</strong>. Các sản phẩm của shop được ghim nhãn RentHub Guaranteed để tăng độ tin cậy.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <Button
                onClick={() => navigate('/merchant')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm"
              >
                Vào Kênh Quản trị Đối tác (/merchant) →
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectTab('profile')}
                className="w-full text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Nâng cấp cấp bậc Đối tác (M1 → M4)
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
