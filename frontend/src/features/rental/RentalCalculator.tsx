import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Truck, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { formatCurrency, sleep } from '@/shared/lib/utils';
import type { Product } from '@/entities/product/product.types';

interface RentalCalculatorProps {
  product: Product;
}

export function RentalCalculator({ product }: RentalCalculatorProps) {
  const navigate = useNavigate();
  const { role, tier, getDepositRate } = useAuthStore();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!deliveryAddress) {
      setDeliveryFee(null);
      return;
    }

    setIsCheckingDelivery(true);
    const timer = setTimeout(() => {
      if (deliveryAddress.length > 5) {
        setDeliveryFee(product.pricePerDay * 0.05); // 5% of daily price
      } else {
        setDeliveryFee(null);
      }
      setIsCheckingDelivery(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [deliveryAddress, product]);

  const depositRate = getDepositRate();
  const calculatedDeposit = product.depositAmount * depositRate;
  
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }, [startDate, endDate]);

  const rentalTotal = product.pricePerDay * days;
  const finalTotal = rentalTotal + calculatedDeposit + (deliveryFee || 0);

  const handleRent = async () => {
    if (role === 'GUEST') {
      toast.error('Vui lòng đăng nhập để thuê sản phẩm');
      navigate('/auth');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn ngày thuê');
      return;
    }

    setIsSubmitting(true);
    await sleep(1000);

    if (Math.random() < 0.25) {
      toast.error('Rất tiếc! Sản phẩm vừa được người khác đặt trong khoảng thời gian này.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      productId: product.id,
      startDate,
      endDate,
      deliveryAddress,
    };
    console.log('Booking Payload:', payload);
    
    toast.success('Gửi yêu cầu thuê thành công! Đối tác sẽ sớm liên hệ.');
    setIsSubmitting(false);
  };

  const isGuestG1 = role === 'GUEST' && tier === 'G1';
  const isGuestG2 = role === 'GUEST' && tier === 'G2';
  const isGuest = isGuestG1 || isGuestG2;
  const disableDates = isGuestG2 || isGuestG1;

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24">
        <Card className="border-gray-200 shadow-xl shadow-gray-200/50">
          <CardContent className="p-6">
            <div className="mb-6 flex items-end gap-2 border-b border-gray-100 pb-6">
              <span className="text-3xl font-extrabold text-primary-600">
                {formatCurrency(product.pricePerDay)}
              </span>
              <span className="text-gray-500 font-medium mb-1">/ ngày</span>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500">Từ ngày</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-9 text-sm h-11"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={disableDates}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase text-gray-500">Đến ngày</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      className="pl-9 text-sm h-11"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      disabled={disableDates}
                    />
                  </div>
                </div>
              </div>
              {disableDates && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Vui lòng đăng nhập để chọn ngày thuê.
                </p>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase text-gray-500">Giao hàng (Tùy chọn)</Label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập địa chỉ giao hàng..."
                    className="pl-9 text-sm h-11"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  {isCheckingDelivery && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 rounded-full border-2 border-gray-200 border-t-primary-500 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Giá thuê ({days} ngày)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(rentalTotal)}</span>
                </div>
                
                {deliveryFee !== null && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí giao hàng</span>
                    <span className="font-medium text-gray-900">{formatCurrency(deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-600 items-start">
                  <div className="flex flex-col">
                    <span>
                      Tiền cọc 
                      <span className="font-semibold text-primary-600 ml-1">
                        ({depositRate === 0 ? '0% Net-30' : `${depositRate * 100}%`})
                      </span>
                    </span>
                    {!isGuest && depositRate > 0 && (
                      <Link to="/profile/upgrade" className="text-xs text-accent-600 hover:underline mt-0.5">
                        Nâng hạng để giảm cọc?
                      </Link>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{formatCurrency(calculatedDeposit)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-2xl font-extrabold text-primary-600">{formatCurrency(finalTotal)}</span>
                </div>
                <Button
                  size="xl"
                  className="w-full text-base"
                  onClick={handleRent}
                  loading={isSubmitting}
                  disabled={product.status !== 'AVAILABLE'}
                >
                  {product.status === 'AVAILABLE' ? 'Xác Nhận Thuê' : 'Đang cho thuê / Không khả dụng'}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Giao dịch được bảo vệ 100%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Fixed CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Tổng cộng</span>
            <span className="text-lg font-bold text-primary-600">{formatCurrency(finalTotal)}</span>
          </div>
          <Button
            className="flex-1 max-w-[200px]"
            onClick={handleRent}
            loading={isSubmitting}
            disabled={product.status !== 'AVAILABLE'}
          >
            {product.status === 'AVAILABLE' ? 'Xác Nhận Thuê' : 'Hết hàng'}
          </Button>
        </div>
      </div>
    </>
  );
}
