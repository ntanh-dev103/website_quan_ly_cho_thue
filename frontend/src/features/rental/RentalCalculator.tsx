import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Truck, 
  ShieldCheck, 
  ShoppingCart, 
  Zap, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { 
  catalogApi, 
  type ProductAvailability, 
  type RentalCalculationRes 
} from '@/api/catalog.api';
import { formatCurrency } from '@/shared/lib/utils';
import type { Product } from '@/entities/product/product.types';

interface RentalCalculatorProps {
  product: Product;
}

export function RentalCalculator({ product }: RentalCalculatorProps) {
  const navigate = useNavigate();
  const { isAuthenticated, tier } = useAuthStore();
  const { addItem, setIsOpen: setCartOpen } = useGhostCartStore();

  // Tomorrow as default start, +3 days as default end
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const defaultEndStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [availability, setAvailability] = useState<ProductAvailability | null>(null);
  const [calcResult, setCalcResult] = useState<RentalCalculationRes | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch live product availability & booked ranges
  useEffect(() => {
    if (!product?.id) return;
    catalogApi.getProductAvailability(product.id)
      .then((data) => setAvailability(data))
      .catch(() => setAvailability(null));
  }, [product?.id]);

  // 2. Check if selected dates overlap with busy booked ranges
  const hasDateOverlap = useMemo(() => {
    if (!startDate || !endDate || !availability?.bookedDateRanges?.length) return false;
    const startTs = new Date(startDate).getTime();
    const endTs = new Date(endDate).getTime();

    return availability.bookedDateRanges.some((range) => {
      const rStart = new Date(range.startDate).getTime();
      const rEnd = new Date(range.endDate).getTime();
      return startTs <= rEnd && endTs >= rStart;
    });
  }, [startDate, endDate, availability]);

  // 3. Number of rental days
  const days = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  }, [startDate, endDate]);

  // 4. Calculate live rental breakdown from Backend API
  useEffect(() => {
    if (!product?.id || !startDate || !endDate) return;

    setIsCalculating(true);
    const timer = setTimeout(() => {
      catalogApi.calculateRental({
        productId: Number(product.id),
        startDate,
        endDate,
        deliveryAddress: deliveryAddress.trim() || undefined,
        customerTier: tier,
      })
        .then((res) => {
          setCalcResult(res);
        })
        .catch(() => {
          setCalcResult(null);
        })
        .finally(() => {
          setIsCalculating(false);
        });
    }, 280);

    return () => clearTimeout(timer);
  }, [product?.id, startDate, endDate, deliveryAddress, tier]);

  // Fallback calculation numbers
  const rentalFee = calcResult ? calcResult.rentalFee : product.pricePerDay * days;
  const depositAmount = calcResult ? calcResult.depositAmount : product.depositAmount * 0.4;
  const depositDiscount = calcResult?.depositDiscountAmount ?? 0;
  const deliveryFee = calcResult?.deliveryFee ?? (deliveryAddress.trim() ? 30000 : 0);
  const totalAmount = calcResult ? calcResult.totalAmount : rentalFee + depositAmount + deliveryFee;

  // Validation
  const validateDates = () => {
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn ngày bắt đầu và ngày kết thúc thuê');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Ngày bắt đầu phải trước ngày kết thúc');
      return false;
    }
    if (hasDateOverlap) {
      toast.error('Khoảng ngày bạn chọn đã có người đặt trước. Vui lòng chọn ngày khác!');
      return false;
    }
    return true;
  };

  // Action 1: Add to Ghost Cart
  const handleAddToCart = () => {
    if (!validateDates()) return;
    addItem(product, days, startDate, endDate);
    setCartOpen(true);
  };

  // Action 2: Direct Fast Checkout
  const handleRentNow = async () => {
    if (!validateDates()) return;
    
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để hoàn tất hợp đồng điện tử');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    addItem(product, days, startDate, endDate);
    toast.success('Đang khởi tạo hợp đồng thuê điện tử...');
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/checkout');
    }, 400);
  };

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24">
        <Card className="border-gray-200/80 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 sm:p-7 space-y-6">
            
            {/* Header: Price & Inventory Badge */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-5">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Giá thuê niêm yết
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-primary-600 tracking-tight">
                    {formatCurrency(product.pricePerDay)}
                  </span>
                  <span className="text-sm font-semibold text-gray-500">/ ngày</span>
                </div>
              </div>

              {/* Live stock badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {availability?.availableItems !== undefined 
                    ? `Còn ${availability.availableItems} máy sẵn sàng`
                    : 'Sẵn sàng giao ngay'}
                </span>
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rent-start-date" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary-600" />
                    Từ ngày nhận
                  </Label>
                  <Input
                    id="rent-start-date"
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="text-xs sm:text-sm font-medium h-10 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="rent-end-date" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary-600" />
                    Đến ngày trả
                  </Label>
                  <Input
                    id="rent-end-date"
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs sm:text-sm font-medium h-10 rounded-xl"
                  />
                </div>
              </div>

              {/* Busy range warning */}
              {hasDateOverlap && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2 animate-fade-in">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Khoảng ngày này đã kín máy!</strong> Vui lòng lùi lịch hoặc chọn thiết bị tương tự trong danh mục.
                  </span>
                </div>
              )}

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <Label htmlFor="delivery-address" className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-primary-600" />
                    Địa chỉ giao nhận tận nơi
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Tùy chọn</span>
                </Label>
                <Input
                  id="delivery-address"
                  placeholder="VD: 123 Nguyễn Huệ, Quận 1, TP. HCM..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="text-xs sm:text-sm h-10 rounded-xl placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Price & Deposit Breakdown */}
            <div className="rounded-2xl bg-gray-50/80 p-4 border border-gray-100 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-gray-600">
                <span>
                  Tiền thuê thiết bị <span className="font-semibold text-gray-900">({days} ngày)</span>:
                </span>
                <span className="font-bold text-gray-900">{formatCurrency(rentalFee)}</span>
              </div>

              {/* Tier Deposit Calculation */}
              <div className="flex justify-between items-start text-gray-600 pt-1 border-t border-gray-200/50">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span>Tiền đặt cọc</span>
                    <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-primary-100 text-primary-700">
                      {calcResult?.tierBadge || (tier === 'C4' ? '💎 C4 (0đ)' : `${tier} (40%)`)}
                    </span>
                  </div>
                  {depositDiscount > 0 && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Sparkles className="h-3 w-3" />
                      Ưu đãi hạng: Giảm {formatCurrency(depositDiscount)} cọc
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`font-bold ${depositAmount === 0 ? 'text-emerald-600 font-extrabold' : 'text-gray-900'}`}>
                    {depositAmount === 0 ? '0đ (Miễn cọc)' : formatCurrency(depositAmount)}
                  </span>
                  {depositDiscount > 0 && (
                    <span className="block text-[11px] text-gray-400 line-through">
                      {formatCurrency(depositAmount + depositDiscount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Fee */}
              {deliveryFee > 0 && (
                <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-gray-200/50">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-gray-400" />
                    Phí vận chuyển ước tính:
                  </span>
                  <span className="font-bold text-gray-900">{formatCurrency(deliveryFee)}</span>
                </div>
              )}

              {/* Total Initial Payment */}
              <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    Tổng thanh toán ban đầu
                    {isCalculating && <Loader2 className="h-3 w-3 animate-spin text-primary-500" />}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    (Hoàn cọc 100% khi bàn giao máy)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-primary-600 tracking-tight">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Button 1: Fast Checkout */}
              <Button
                type="button"
                className="w-full h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                onClick={handleRentNow}
                disabled={isSubmitting || hasDateOverlap || product.status !== 'AVAILABLE'}
              >
                <Zap className="h-4 w-4" />
                {isSubmitting ? 'Đang xử lý...' : 'Thuê Ngay Hỏa Tốc'}
              </Button>

              {/* Button 2: Add to Ghost Cart Drawer */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-xs sm:text-sm font-semibold border-gray-300 hover:border-primary-400 hover:bg-primary-50/40 text-gray-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleAddToCart}
                disabled={hasDateOverlap || product.status !== 'AVAILABLE'}
              >
                <ShoppingCart className="h-4 w-4 text-primary-600" />
                Thêm Vào Giỏ Thuê
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Bảo chứng hoàn cọc 100%
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-600" />
                Biên bản bàn giao số
              </span>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Mobile Fixed CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Tổng ban đầu ({days} ngày)</span>
            <span className="text-lg font-black text-primary-600 truncate">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="h-10 px-3 rounded-xl border-gray-300 text-gray-800"
              onClick={handleAddToCart}
              disabled={hasDateOverlap || product.status !== 'AVAILABLE'}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="h-10 px-4 rounded-xl font-bold bg-primary-600 text-white shadow-md shadow-primary-500/20"
              onClick={handleRentNow}
              disabled={isSubmitting || hasDateOverlap || product.status !== 'AVAILABLE'}
            >
              <Zap className="h-4 w-4 mr-1" />
              Thuê ngay
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
