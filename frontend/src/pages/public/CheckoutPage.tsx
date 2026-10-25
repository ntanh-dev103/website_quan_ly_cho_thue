import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Truck, 
  MapPin, 
  ShieldCheck,
  Lock,
  ChevronRight,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Printer,
  PenTool,
  RotateCcw,
  Building2,
  User,
  X
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useContractStore } from '@/entities/contract/useContractStore';
import { contractApi } from '@/api/contract.api';
import { TierBadge } from '@/shared/ui/TierBadge';
import { ContractPdfModal } from '@/features/contract/ContractPdfModal';
import type { Contract } from '@/entities/contract/contract.types';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useGhostCartStore();
  const { user, tier, customerTier } = useAuthStore();
  const { addContract } = useContractStore();

  const activeTier = tier.startsWith('C') ? tier : customerTier || 'C1';

  // Form State - dynamically populated from logged in account
  const [recipientName, setRecipientName] = useState(user?.name || 'Phạm Văn Thuê');
  const [phone, setPhone] = useState(user?.phone || '0903 000 004');
  const [address, setAddress] = useState(user?.address || '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh');
  const [shippingMethod, setShippingMethod] = useState<'EXPRESS' | 'STANDARD' | 'PICKUP'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'QR_NAPAS' | 'ESCROW' | 'CARD' | 'COD'>('QR_NAPAS');
  const [note, setNote] = useState('');
  const [isAgreed, setIsAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Digital Signature & Confirmation Modals
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [signedContract, setSignedContract] = useState<Contract | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<'EKYC' | 'DRAW'>('EKYC');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Canvas for hand-drawn signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Sync user info when profile changes
  useEffect(() => {
    if (user?.name) setRecipientName(user.name);
    if (user?.phone) setPhone(user.phone);
    if (user?.address) setAddress(user.address);
  }, [user]);

  // Tier Deposit Discount
  const depositRate = 
    activeTier === 'C4' ? 0.0 :
    activeTier === 'C3' ? 0.15 :
    activeTier === 'C2' ? 0.30 : 0.40;

  const rawRentFee = items.reduce((sum, item) => sum + item.product.pricePerDay * item.days, 0);
  const rawDeposit = items.reduce((sum, item) => sum + Math.round(item.product.depositAmount * depositRate), 0);
  const shippingFee = shippingMethod === 'EXPRESS' ? 60000 : shippingMethod === 'STANDARD' ? 30000 : 0;
  const totalInitialPayment = rawRentFee + rawDeposit + shippingFee;

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawnSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Dark blue ink
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Step 1: Open Digital Contract Signing Review
  const handleOpenSignatureModal = (e: React.FormEvent) => {
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

    setIsSignModalOpen(true);
  };

  // Step 2: Finalize Digital Signature & Activate Contract
  const handleFinalizeSigning = async () => {
    if (signatureType === 'DRAW' && !hasDrawnSignature) {
      toast.error('Vui lòng vẽ chữ ký tay trên khung ký trước khi xác nhận!');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      let lastContract: Contract | null = null;

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

        const newContractData: Contract = {
          id: `ctr-${contractRes.id || Date.now()}`,
          contractCode: `HD-${contractRes.id || Math.floor(1000 + Math.random() * 9000)}`,
          product: item.product,
          customer: user || {
            id: 'c-1',
            name: recipientName,
            email: 'customer@demo.com',
            roles: ['CUSTOMER'],
            customerTier: activeTier as any,
            createdAt: now.toISOString(),
          },
          merchantId: String(item.product.merchant.id),
          startDate,
          endDate,
          totalDays: item.days,
          rentalFee: itemRent,
          depositAmount: itemDeposit,
          deliveryFee: shippingFee,
          totalAmount: itemRent + itemDeposit + shippingFee,
          status: 'ACTIVE',
          createdAt: now.toISOString(),
          deliveryAddress: address,
          paymentMethod,
        };

        // 3. Save to local contract store for reactive UI
        addContract(newContractData);
        lastContract = newContractData;
      }

      setSignedContract(lastContract);
      clearCart();
      setIsSignModalOpen(false);
      setIsSuccessModalOpen(true);

      toast.success('🎉 Ký hợp đồng điện tử thành công!', {
        description: `Đã kích hoạt hợp đồng và bảo chứng qua RentHub Escrow.`,
        duration: 5000,
      });
    } catch {
      toast.error('Có lỗi xảy ra khi xác nhận hợp đồng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
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
              <Lock className="h-3 w-3" /> Bảo chứng RentHub Escrow 100%
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Hợp đồng điện tử có giá trị pháp lý song phương. Tiền cọc được khóa độc lập và tự động hoàn lại ngay khi bàn giao lại máy.
          </p>
        </div>

        {items.length === 0 && !isSuccessModalOpen ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Giỏ đồ thuê đang trống</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Bạn chưa có thiết bị nào trong danh sách thuê. Hãy duyệt danh mục và chọn thiết bị bạn muốn thuê!
            </p>
            <Button onClick={() => navigate('/catalog')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold cursor-pointer">
              Xem Danh Mục Thiết Bị
            </Button>
          </div>
        ) : (
          <form onSubmit={handleOpenSignatureModal} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
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
                    <TierBadge role="CUSTOMER" tier={activeTier as any} size="sm" variant="code" />
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
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
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
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      shippingMethod === 'EXPRESS'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-950 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold flex items-center gap-1.5">
                        <span>⚡ Giao hỏa tốc 2H</span>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">Đơn vị Grab/Ahamove giao tận tay</p>
                    </div>
                    <p className="font-bold text-primary-700 mt-2">60.000 đ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('STANDARD')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      shippingMethod === 'STANDARD'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-950 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">🚚 Tiêu chuẩn trong ngày</p>
                      <p className="text-[11px] text-gray-500 mt-1">Giao trong 4-8 tiếng làm việc</p>
                    </div>
                    <p className="font-bold text-primary-700 mt-2">30.000 đ</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('PICKUP')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      shippingMethod === 'PICKUP'
                        ? 'border-primary-600 bg-primary-50/50 text-primary-950 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold">🏬 Nhận tại Hub đối tác</p>
                      <p className="text-[11px] text-gray-500 mt-1">Tự đến cửa hàng test & ký</p>
                    </div>
                    <p className="font-bold text-emerald-600 mt-2">Miễn phí (0 đ)</p>
                  </button>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CreditCard className="h-4 w-4 text-primary-600" />
                  Phương Thức Ký Quỹ & Thanh Toán Tiền Thuê
                </h3>

                <div className="space-y-3 text-xs">
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
                        <p className="font-bold text-gray-900">Quét mã QR Chuyển khoản (VietQR / Napas 24/7)</p>
                        <p className="text-[11px] text-gray-500">Khuyên dùng • Xác nhận tự động & Hoàn cọc tức thì trong 24h</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full">
                      Tự động 100%
                    </span>
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
                        <p className="font-bold text-gray-900">Số dư Ký quỹ RentHub Escrow Wallet</p>
                        <p className="text-[11px] text-gray-500">Dùng số dư đã có trong tài khoản • Không mất phí giao dịch</p>
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

            {/* Right Column: Order Summary & E-Contract CTA */}
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

                  {depositRate === 0 && (
                    <p className="text-[11px] text-cyan-700 font-bold bg-cyan-50 p-2 rounded-lg border border-cyan-200">
                      💎 Đặc quyền Hạng C4 Kim Cương: Miễn 100% tiền đặt cọc (0% cọc)!
                    </p>
                  )}

                  {depositRate > 0 && depositRate < 0.40 && (
                    <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ✨ Bạn đã được giảm {Math.round((0.40 - depositRate) * 100)}% tiền cọc nhờ đặc quyền hội viên {activeTier}!
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
                      của RentHub và cam kết bảo quản tài sản đúng hiện trạng.
                    </span>
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isAgreed}
                    className="w-full py-4 text-sm font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-primary-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>Xác Nhận & Ký Hợp Đồng Điện Tử</span>
                  </Button>
                </div>

              </div>

            </div>

          </form>
        )}

      </div>

      {/* =====================================================================
          MODAL 1: DIGITAL CONTRACT PREVIEW & E-SIGNATURE (XÁC THỰC KÝ SỐ)
         ===================================================================== */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-primary-950 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-600 rounded-lg text-white">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Xác Nhận Ký Hợp Đồng Điện Tử</h3>
                  <p className="text-xs text-slate-300">
                    Bảo chứng Escrow pháp lý song phương • Giá trị số hợp lệ
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSignModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700 leading-relaxed">
              
              {/* Legal Title Header */}
              <div className="text-center pb-3 border-b border-gray-200 space-y-1">
                <p className="font-extrabold text-sm uppercase text-gray-900 tracking-wider">
                  HỢP ĐỒNG CHO THUÊ THIẾT BỊ ĐIỆN TỬ
                </p>
                <p className="text-[11px] text-gray-500">
                  Số: <span className="font-mono font-bold text-primary-700">HD-2026-{Math.floor(1000 + Math.random() * 9000)}</span> • Ngày ký: {new Date().toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* Parties Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200/80">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary-600" />
                    <span>BÊN CHO THUÊ (Bên A)</span>
                  </p>
                  <p className="text-gray-700 font-semibold">{items[0]?.product.merchant.name || 'Đối tác RentHub Pro'}</p>
                  <p className="text-[11px] text-gray-500">Đại diện đối tác ủy quyền sàn RentHub</p>
                </div>

                <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-3">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    <span>BÊN THUÊ (Bên B)</span>
                  </p>
                  <p className="text-gray-700 font-semibold">{recipientName}</p>
                  <p className="text-[11px] text-gray-500 font-mono">SĐT: {phone} • Hạng: {activeTier}</p>
                </div>
              </div>

              {/* Rented Items Summary */}
              <div className="space-y-2">
                <p className="font-bold text-gray-900">Danh mục thiết bị & Giá trị hợp đồng:</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {items.map((it) => (
                    <div key={it.product.id} className="p-3 flex items-center justify-between bg-white text-[11px]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={it.product.imageUrl || it.product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'}
                          alt={it.product.name}
                          className="h-10 w-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{it.product.name}</p>
                          <p className="text-gray-500">Thuê {it.days} ngày ({formatCurrency(it.product.pricePerDay)}/ngày)</p>
                        </div>
                      </div>
                      <div className="text-right font-bold text-gray-900">
                        {formatCurrency(it.product.pricePerDay * it.days)}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50 flex items-center justify-between font-bold text-gray-900">
                    <span>Tổng tiền thanh toán ban đầu (Thuê + Cọc + Vận chuyển):</span>
                    <span className="text-primary-700 text-sm">{formatCurrency(totalInitialPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Essential Terms */}
              <div className="space-y-1.5 bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 text-[11px] text-blue-950">
                <p className="font-bold text-blue-900">Điều khoản cam kết trọng yếu:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-900/90">
                  <li>Bên B cam kết bảo quản tài sản đúng hiện trạng và hoàn trả đúng ngày hẹn.</li>
                  <li>Tiền cọc được bảo chứng an toàn qua RentHub Escrow và tự động hoàn trả trong vòng 24h sau khi hoàn tất trả máy.</li>
                  <li>Hợp đồng điện tử có đầy đủ giá trị pháp lý theo Luật Giao dịch Điện tử Việt Nam số 51/2005/QH11 và Nghị định 52/2013/NĐ-CP.</li>
                </ul>
              </div>

              {/* Signature Method Toggle */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">Phương thức ký số:</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSignatureType('EKYC')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        signatureType === 'EKYC'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Ký số eKYC RentHub
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureType('DRAW')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        signatureType === 'DRAW'
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Vẽ chữ ký tay
                    </button>
                  </div>
                </div>

                {/* Mode 1: eKYC Digital Seal Stamp */}
                {signatureType === 'EKYC' && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <ShieldCheck className="h-7 w-7" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-black text-emerald-900 text-xs uppercase tracking-wider">
                          ĐÃ XÁC THỰC KÝ SỐ ĐIỆN TỬ RENTHUB TRUST
                        </p>
                        <p className="text-[11px] text-emerald-800">
                          Người ký: <strong>{recipientName}</strong> (Hạng: {activeTier})
                        </p>
                        <p className="text-[10px] text-emerald-700 font-mono">
                          Thời gian: {new Date().toLocaleString('vi-VN')} • SHA256: 7f8a9b2c4d5e...3e1d
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full uppercase shrink-0">
                      Hợp Lệ Pháp Lý
                    </span>
                  </div>
                )}

                {/* Mode 2: Interactive Hand-drawn Canvas */}
                {signatureType === 'DRAW' && (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={550}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-[120px] touch-none cursor-crosshair bg-white"
                      />
                      {!hasDrawnSignature && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-400 text-xs">
                          <PenTool className="h-4 w-4 mr-1.5 opacity-50" />
                          <span>Dùng chuột hoặc ngón tay để vẽ chữ ký của bạn tại đây</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-gray-500">
                      <span>Chữ ký tay điện tử của người thuê</span>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Xóa ký lại</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSignModalOpen(false)}
                disabled={isSubmitting}
                className="text-xs h-9 font-semibold cursor-pointer"
              >
                Quay lại
              </Button>
              <Button
                type="button"
                onClick={handleFinalizeSigning}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 gap-2 shadow-sm shadow-emerald-600/30 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Đang kích hoạt...</span>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>Ký Số & Hoàn Tất Thuê Ngay</span>
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: ORDER SUCCESS & CONTRACT ACTIVATED CONFIRMATION
         ===================================================================== */}
      {isSuccessModalOpen && signedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 sm:p-8 text-center space-y-6">
            
            {/* Glowing Icon */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="h-10 w-10" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Hợp đồng điện tử đã kích hoạt thành công</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Thuê Thiết Bị Thành Công!
              </h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Hợp đồng <span className="font-mono font-bold text-primary-700">{signedContract.contractCode}</span> đã được bảo chứng Escrow. Đối tác đang đóng gói và chuẩn bị bàn giao cho bạn.
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 text-left space-y-2.5 text-xs">
              <div className="flex items-center gap-3 pb-2.5 border-b border-gray-200">
                <img
                  src={signedContract.product.imageUrl || signedContract.product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'}
                  alt={signedContract.product.name}
                  className="h-12 w-12 rounded-xl object-cover bg-white border border-gray-200"
                />
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{signedContract.product.name}</p>
                  <p className="text-[11px] text-gray-500">Mã HĐ: <span className="font-mono font-semibold">{signedContract.contractCode}</span></p>
                </div>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Thời hạn thuê:</span>
                <span className="font-bold text-gray-900">{signedContract.totalDays} ngày ({new Date(signedContract.startDate).toLocaleDateString('vi-VN')} → {new Date(signedContract.endDate).toLocaleDateString('vi-VN')})</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tổng chi phí:</span>
                <span className="font-extrabold text-primary-700">{formatCurrency(signedContract.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Địa chỉ bàn giao:</span>
                <span className="font-medium text-gray-900 truncate max-w-[200px]">{signedContract.deliveryAddress}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={() => navigate('/account?tab=renting-in')}
                className="w-full py-3.5 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Vào Quản Lý Đang Thuê (Customer)</span>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPdfModalOpen(true)}
                  className="w-full text-xs font-semibold border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5 text-primary-600" />
                  <span>Xem Hợp Đồng PDF</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full text-xs font-semibold border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl cursor-pointer"
                >
                  Về Trang Chủ
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: OFFICIAL PDF CONTRACT VIEWER & PRINTER
         ===================================================================== */}
      <ContractPdfModal
        contract={signedContract}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

    </div>
  );
}
