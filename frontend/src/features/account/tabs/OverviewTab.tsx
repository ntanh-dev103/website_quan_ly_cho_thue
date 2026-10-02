import { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  ShoppingCart, 
  Store, 
  RefreshCw, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { mockActiveRentals, mockIncomingOrders } from '../account.mock';
import type { IncomingOrder } from '../account.types';
import { toast } from 'sonner';

interface OverviewTabProps {
  onSelectTab: (tabId: string) => void;
  onOpenRelistModal: () => void;
}

export function OverviewTab({ onSelectTab, onOpenRelistModal }: OverviewTabProps) {
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>(mockIncomingOrders);

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
      {/* SECTION 2: HERO METRIC CARD */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 relative overflow-hidden">
        {/* Subtle background circular flow gradient */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Số dư ròng (Net Balance)
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp className="h-3 w-3" /> Kinh tế tuần hoàn
              </span>
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

          {/* Quick Action Button: "🔄 Chuyển đồ" */}
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

      {/* SECTION 2: TWO-COLUMN FLOW (Grid cols-1 lg:cols-2 gap-6) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: "Đang thuê VÀO" (Customer side) */}
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

            {/* List of 3 recent Active Contracts */}
            <div className="space-y-3">
              {mockActiveRentals.slice(0, 3).map((item) => (
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
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Tổng cộng: <strong>3 hợp đồng đang chạy</strong></span>
            <button
              onClick={() => onSelectTab('renting-in')}
              className="text-primary-600 font-semibold hover:underline"
            >
              Yêu cầu trả hàng & hoàn cọc →
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: "Cho thuê RA" (Merchant side) */}
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

      </div>
    </div>
  );
}
