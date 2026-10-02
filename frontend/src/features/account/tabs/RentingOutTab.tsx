import { useState } from 'react';
import { 
  Package, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { FeatureGate } from '@/shared/ui/FeatureGate';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { formatCurrency } from '@/shared/lib/utils';
import { mockIncomingOrders, mockInventoryPreview } from '../account.mock';
import type { IncomingOrder } from '../account.types';
import { toast } from 'sonner';

interface RentingOutTabProps {
  onSelectTab: (tabId: string) => void;
}

export function RentingOutTab({ onSelectTab }: RentingOutTabProps) {
  const { tier, merchantTier, updateTier } = useAuthStore();
  const [orders, setOrders] = useState<IncomingOrder[]>(mockIncomingOrders);
  const [autoApprove, setAutoApprove] = useState(false);

  // Active merchant tier check
  const activeMerchantTier = tier.startsWith('M') ? tier : merchantTier;
  const isM1 = activeMerchantTier === 'M1';

  const pendingCount = orders.filter(o => o.status === 'PENDING_CONFIRMATION').length;

  const handleApproveOrder = (orderId: string, contractCode: string) => {
    setOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, status: 'APPROVED' } : ord)
    );
    toast.success(`Đã xác nhận chuẩn bị hàng cho đơn ${contractCode}!`, {
      description: 'Khách hàng đã nhận được thông báo để tới nhận hàng hoặc chờ shipper.',
    });
  };

  const handleRejectOrder = (orderId: string, contractCode: string) => {
    setOrders(prev =>
      prev.map(ord => ord.id === orderId ? { ...ord, status: 'REJECTED' } : ord)
    );
    toast.info(`Đã từ chối đơn hàng ${contractCode}. Cọc Escrow của khách đã được giải tỏa hoàn trả.`);
  };

  const handleUpgradeToM2 = () => {
    updateTier('M2');
    toast.success('Đã nâng cấp lên M2 Pro thành công!', {
      description: 'Giới hạn 20 sản phẩm đã được dỡ bỏ. Hoa hồng sàn giảm xuống 10%. Tính năng Auto-Approve đã sẵn sàng.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECTION 4: TIER LIMIT WARNING (IF MERCHANT IS M1) */}
      {isM1 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">
                Cảnh báo giới hạn gói Starter (M1)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Bạn đang giới hạn 20 sản phẩm (M1 Starter). Nâng cấp lên M2 Pro để mở khóa đăng sản phẩm không giới hạn, giảm phí hoa hồng sàn còn 10% và bật duyệt tự động.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleUpgradeToM2}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg px-4 shadow-sm"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              Nâng cấp lên M2 Pro
            </Button>
            <Button
              variant="outline"
              onClick={() => onSelectTab('profile')}
              className="border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-semibold"
            >
              Xem chi tiết cấp bậc
            </Button>
          </div>
        </div>
      )}

      {/* METRICS ROW (Grid cols-2 lg:cols-4 gap-4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Đang cho thuê */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Đang cho thuê</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">18</div>
          <p className="text-[11px] text-gray-500 mt-1">sản phẩm ngoài kho</p>
        </div>

        {/* Card 2: Chờ xác nhận (Yellow Badge) */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Chờ xác nhận</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-gray-900">{pendingCount}</div>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Cần duyệt gấp
            </span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Yêu cầu phản hồi trong 2 giờ
          </p>
        </div>

        {/* Card 3: Hôm nay kiếm được */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Hôm nay kiếm được</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {formatCurrency(2450000)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            + 15% so với trung bình tuần
          </p>
        </div>

        {/* Card 4: Sức khỏe kho */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sức khỏe kho</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600">94%</div>
          <p className="text-[11px] text-gray-500 mt-1">Sẵn sàng & không hư hại</p>
        </div>
      </div>

      {/* Auto-Approve FeatureGate Header */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Tự động duyệt đơn (Auto-Approve bookings)
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                Yêu cầu M2 Pro
              </span>
            </h4>
            <p className="text-xs text-gray-500">
              Tự động chấp nhận đơn của khách hàng hạng C2 trở lên đã ký quỹ cọc thành công
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Feature Gate: Auto-Approve for M2+ */}
          {isM1 ? (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <span className="text-xs font-semibold text-gray-500">Bị khóa (M1)</span>
              <FeatureGate requiredTier="M2">
                <button disabled className="text-gray-300 cursor-not-allowed">
                  <ToggleLeft className="h-6 w-6" />
                </button>
              </FeatureGate>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800">
                {autoApprove ? 'Đang bật Auto-Approve' : 'Đang tắt'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoApprove(!autoApprove);
                  toast.success(
                    autoApprove ? 'Đã tắt tính năng Auto-Approve' : 'Đã kích hoạt Auto-Approve cho khách hàng C2+!'
                  );
                }}
                className={`transition-colors ${autoApprove ? 'text-emerald-600' : 'text-gray-400'}`}
              >
                {autoApprove ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* INCOMING ORDERS TABLE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            Đơn hàng đến cần xử lý (Incoming Orders)
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              {pendingCount} chờ duyệt
            </span>
          </h3>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã HĐ</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Sản phẩm cho thuê</th>
                  <th className="py-3 px-4">Tổng tiền & Cọc</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {order.contractCode}
                        <span className="block text-[10px] font-normal text-gray-400">
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.customerAvatar}
                            alt={order.customerName}
                            className="h-8 w-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{order.customerName}</p>
                            <span className="inline-block text-[10px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded">
                              {order.customerTier}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="h-10 w-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 truncate">{order.productName}</p>
                            <p className="text-[11px] text-gray-500">
                              Thuê: {order.rentalDays} ngày • Bắt đầu {order.startDate}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-emerald-600 block">
                            {formatCurrency(order.totalAmount)}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Cọc giữ: {formatCurrency(order.depositAmount)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.status === 'PENDING_CONFIRMATION'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : order.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {order.status === 'PENDING_CONFIRMATION'
                            ? 'Chờ xác nhận'
                            : order.status === 'APPROVED'
                            ? 'Đã duyệt hàng'
                            : 'Đã từ chối'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {order.status === 'PENDING_CONFIRMATION' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleApproveOrder(order.id, order.contractCode)}
                              className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold h-8 px-3"
                            >
                              Xác nhận chuẩn bị hàng
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectOrder(order.id, order.contractCode)}
                              className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold h-8 px-2.5"
                            >
                              Từ chối
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Đã xử lý</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MY INVENTORY PREVIEW (Top 5 items) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Kho hàng của tôi (Inventory Preview)
            </h3>
            <p className="text-xs text-gray-500">Top 5 sản phẩm có hiệu suất cho thuê cao nhất</p>
          </div>

          <a
            href="/merchant/inventory"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>Quản lý toàn bộ kho hàng (20 sản phẩm)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {mockInventoryPreview.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200/80 p-3 shadow-2xs space-y-2 flex flex-col justify-between hover:border-primary-300 transition-all"
            >
              <div>
                <div className="relative mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-28 object-cover rounded-lg bg-gray-100"
                  />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.status === 'AVAILABLE' ? 'Sẵn sàng' : 'Đang thuê'}
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-900 line-clamp-2">
                  {item.name}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-primary-600">
                  {formatCurrency(item.pricePerDay)}/ngày
                </span>
                <span className="text-[11px] text-gray-400">
                  {item.totalRentals} lượt thuê
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
