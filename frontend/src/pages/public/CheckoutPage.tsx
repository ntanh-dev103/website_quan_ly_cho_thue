import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Truck, 
  MapPin, 
  ShieldCheck,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useContractStore } from '@/entities/contract/useContractStore';
import { contractApi } from '@/api/contract.api';
import { TierBadge } from '@/shared/ui/TierBadge';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useGhostCartStore();
  const { user, tier, customerTier } = useAuthStore();
  const { addContract } = useContractStore();

  const activeTier = tier.startsWith('C') ? tier : customerTier || 'C1';

  // Form State
  const [recipientName, setRecipientName] = useState(user?.name || 'Nguyễn Văn A');
  const [phone, setPhone] = useState('0909 123 456');
  const [address, setAddress] = useState('Số 12, Phố Tràng Thi, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội');
  const [shippingMethod, setShippingMethod] = useState<'EXPRESS' | 'STANDARD' | 'PICKUP'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'QR_NAPAS' | 'ESCROW' | 'CARD' | 'COD'>('QR_NAPAS');
  const [note, setNote] = useState('');
  const [isAgreed, setIsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tier Deposit Discount
  const depositRate = 
    activeTier === 'C4' ? 0.0 :
    activeTier === 'C3' ? 0.15 :
    activeTier === 'C2' ? 0.30 : 0.40;

  const rawRentFee = items.reduce((sum, item) => sum + item.product.pricePerDay * item.days, 0);
  const rawDeposit = items.reduce((sum, item) => sum + Math.round(item.product.depositAmount * depositRate), 0);
  const shippingFee = shippingMethod === 'EXPRESS' ? 60000 : shippingMethod === 'STANDARD' ? 30000 : 0;
  const totalInitialPayment = rawRentFee + rawDeposit + shippingFee;

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      toast.error('Vui lòng đồng ý với điều khoản hợp đồng thuê trước khi tiếp tục!');
      return;
    }

    if (items.length === 0) {
      toast.error('Giỏ hàng trống! Vui lòng chọn thiết bị thuê trước.');
      navigate('/catalog');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();

      for (const item of items) {
        const startDate = item.startDate || now.toISOString();
        const endDate = item.endDate || new Date(now.getTime() + item.days * 86400000).toISOString();
        const itemRent = item.product.pricePerDay * item.days;
        const itemDeposit = Math.round(item.product.depositAmount * depositRate);

        // 1. Call Backend to create contract
        const contractRes = await contractApi.createContract({
          productId: Number(item.product.id) || 1,
          quantity: 1,
          startDate,
          endDate,
          paymentMethod,
          deliveryAddress: address,
          deliveryFee: shippingFee,
          customerTier: activeTier,
          note,
        });

        // 2. Immediate auto-deposit confirmation if user pays now
        await contractApi.depositContract(contractRes.id);

        // 3. Save to local contract store for reactive UI
        addContract({
          contractCode: `HD-${contractRes.id || Math.floor(1000 + Math.random() * 9000)}`,
          product: item.product,
          customer: user || {
            id: 'c-1',
            name: recipientName,
            email: 'customer@rentnest.vn',
            roles: ['CUSTOMER'],
            customerTier: activeTier as any,
            createdAt: now.toISOString(),
          },
          merchantId: item.product.merchant.id,
          startDate,
          endDate,
          totalDays: item.days,
          rentalFee: itemRent,
          depositAmount: itemDeposit,
          deliveryFee: shippingFee,
          totalAmount: itemRent + itemDeposit + shippingFee,
          status: 'ACTIVE',
          deliveryAddress: address,
          paymentMethod,
        });
      }

      clearCart();
      toast.success('🎉 Hợp đồng đã được ký & Kích hoạt thành công!', {
        description: `Đã xác nhận thuê ${items.length} thiết bị. Bạn có thể theo dõi tiến độ và tải hợp đồng PDF tại trang cá nhân.`,
        duration: 5000,
      });

      navigate('/account?tab=renting-in');
    } catch {
      toast.error('Có lỗi xảy ra khi xác nhận hợp đồng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span className="text-gray-900 font-bold">1. Chọn thiết bị</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-primary-600 font-bold">2. Ký hợp đồng & Thanh toán</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>3. Bàn giao thiết bị</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Hoàn Tất Đặt Thuê & Ký Hợp Đồng Điện Tử
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Bảo chứng Escrow 100%
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Hợp đồng có giá trị pháp lý song phương. Tiền cọc được khóa độc lập và hoàn lại ngay khi bàn giao lại máy.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Giỏ đồ thuê đang trống</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Bạn chưa có thiết bị nào trong danh sách thuê. Hãy duyệt danh mục và chọn thiết bị bạn muốn thuê!
            </p>
            <Button onClick={() => navigate('/catalog')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold">
              Xem Danh Mục Thiết Bị
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Information Forms */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Section 1: Customer & Delivery Info */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-600" />
                    Thông Tin Người Nhận & Địa Điểm Bàn Giao
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>Hạng tài khoản:</span>
                    <TierBadge role="CUSTOMER" tier={activeTier as any} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Họ và tên người nhận</label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Số điện thoại liên hệ</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Địa chỉ giao nhận thiết bị tận nơi</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-gray-700 block mb-1">Ghi chú cho Merchant / Đơn vị giao hàng</label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Kiểm tra kỹ pin trước khi bàn giao, giao sau 14h..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Method */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Truck className="h-4 w-4 text-primary-600" />
                  Phương Thức Vận Chuyển & Bàn Giao
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('EXPRESS')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      shippingMethod === 'EXPRESS'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-950 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">⚡ Hỏa tốc 2 giờ</p>
                      <p className="text-[11px] text-gray-500 mt-1">Giao qua Ahamove/Grab Express</p>
                    </div>
                    <p className="font-bold text-primary-700 mt-2">60.000đ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('STANDARD')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      shippingMethod === 'STANDARD'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-950 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">📦 Tiêu chuẩn trong ngày</p>
                      <p className="text-[11px] text-gray-500 mt-1">Giao trong khung giờ hành chính</p>
                    </div>
                    <p className="font-bold text-primary-700 mt-2">30.000đ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('PICKUP')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      shippingMethod === 'PICKUP'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-950 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">🏬 Nhận tại Kho RentNest</p>
                      <p className="text-[11px] text-gray-500 mt-1">Tự đến kiểm tra và lấy máy</p>
                    </div>
                    <p className="font-bold text-emerald-700 mt-2">Miễn phí 0đ</p>
                  </button>
                </div>
              </div>

              {/* Section 3: Payment & Deposit Method */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard className="h-4 w-4 text-primary-600" />
                  Phương Thức Đặt Cọc & Thanh Toán
                </h3>

                <div className="space-y-2 text-xs">
                  <label
                    onClick={() => setPaymentMethod('QR_NAPAS')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'QR_NAPAS'
                        ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="h-5 w-5 text-primary-600" />
                      <div>
                        <p className="font-bold text-gray-900">Quét mã QR Chuyển khoản (VietQR / Napas 247)</p>
                        <p className="text-[11px] text-gray-500">Kích hoạt hợp đồng tự động ngay trong 10 giây</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Khuyên dùng</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('ESCROW')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'ESCROW'
                        ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="font-bold text-gray-900">Ký quỹ Bảo chứng Escrow Safe</p>
                        <p className="text-[11px] text-gray-500">Giữ cọc an toàn, tiền chỉ giải phóng sau khi thẩm định</p>
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-bold text-gray-900">Thẻ Quốc Tế / Thẻ Nội Địa (Visa, Master, Napas)</p>
                        <p className="text-[11px] text-gray-500">Hỗ trợ Pre-Authorization Hold cọc linh hoạt</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Digital Signature */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Items */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  Thiết Bị Thuê ({items.length})
                </h3>

                <div className="space-y-3 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                      <img
                        src={item.product.imageUrl || item.product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Thời gian: <span className="font-semibold text-gray-700">{item.days} ngày</span>
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] text-gray-500">
                            {formatCurrency(item.product.pricePerDay)}/ngày
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatCurrency(item.product.pricePerDay * item.days)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Table */}
                <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền thuê:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(rawRentFee)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1">
                      Tiền đặt cọc ({Math.round(depositRate * 100)}%):
                      <span className="text-[10px] bg-primary-100 text-primary-800 px-1.5 py-0.2 rounded font-bold">
                        Hạng {activeTier}
                      </span>
                    </span>
                    <span className="font-semibold text-gray-900">{formatCurrency(rawDeposit)}</span>
                  </div>

                  {depositRate < 0.40 && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      ✨ Bạn đã được giảm {Math.round((0.40 - depositRate) * 100)}% tiền cọc nhờ đặc quyền hội viên!
                    </p>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(shippingFee)}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                    <span className="font-bold text-gray-900 text-sm">Tổng thanh toán ban đầu:</span>
                    <span className="text-xl font-extrabold text-primary-700">
                      {formatCurrency(totalInitialPayment)}
                    </span>
                  </div>
                </div>

                {/* Legal Agreement */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-gray-600 leading-normal">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span>
                      Tôi đã đọc và đồng thuận với{' '}
                      <span className="text-primary-600 font-bold underline">
                        Điều khoản Hợp đồng cho thuê điện tử
                      </span>{' '}
                      của RentNest và cam kết bảo quản tài sản đúng hiện trạng.
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isAgreed}
                    className="w-full py-4 text-sm font-extrabold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/25 transition-all"
                  >
                    {isSubmitting ? 'Đang kích hoạt hợp đồng...' : 'Xác Nhận Ký Hợp Đồng & Thuê Ngay'}
                  </Button>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}
