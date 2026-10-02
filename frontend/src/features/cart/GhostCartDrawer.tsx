import { useState, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Tag, 
  Check, 
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useContractStore } from '@/entities/contract/useContractStore';
import { formatCurrency } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

interface AppliedVoucher {
  code: string;
  type: 'fixed' | 'percent' | 'shipping';
  amount: number;
  title: string;
}

const QUICK_COUPONS = [
  { code: 'RENTHUB50K', label: 'RENTHUB50K (-50K)', type: 'fixed' as const, amount: 50000, title: 'Giảm 50.000đ đơn đầu' },
  { code: 'FREESHIP', label: 'FREESHIP (-40K)', type: 'fixed' as const, amount: 40000, title: 'Miễn phí giao nhận 2 chiều' },
  { code: 'WEEKEND20', label: 'WEEKEND20 (-20%)', type: 'percent' as const, amount: 0.2, title: 'Giảm 20% gói cuối tuần' },
];

export function GhostCartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, setIsOpen, removeItem, updateDays, clearCart, getTotalPrice } = useGhostCartStore();
  const { isAuthenticated, user, getDepositRate } = useAuthStore();
  const { addContract } = useContractStore();

  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ALL hooks MUST be called before any early return.
  // Compute derived values via useMemo unconditionally.
  const rawSubtotal = useMemo(() => getTotalPrice(), [items]); // eslint-disable-line react-hooks/exhaustive-deps
  const depositRate = getDepositRate ? getDepositRate() : 0.3;

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === 'fixed') {
      return Math.min(rawSubtotal, appliedVoucher.amount);
    }
    if (appliedVoucher.type === 'percent') {
      return Math.min(rawSubtotal * appliedVoucher.amount, 300000);
    }
    return 0;
  }, [appliedVoucher, rawSubtotal]);

  const totalDeposit = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product.depositAmount || 0) * depositRate, 0);
  }, [items, depositRate]);

  const finalRentalTotal = Math.max(0, rawSubtotal - discountAmount);
  const grandTotal = finalRentalTotal + totalDeposit;

  // NOW safe to early-return — all hooks above are always called.
  if (!isOpen) return null;

  const handleApplyVoucher = (codeToApply?: string) => {
    const code = (codeToApply || voucherInput).trim().toUpperCase();
    if (!code) {
      toast.error('Vui lòng nhập mã ưu đãi');
      return;
    }

    const matched = QUICK_COUPONS.find((c) => c.code === code) || (
      code === 'TIERVIP10' 
        ? { code: 'TIERVIP10', label: 'TIERVIP10 (-10%)', type: 'percent' as const, amount: 0.1, title: 'Giảm 10% đặc quyền VIP' } 
        : null
    );

    if (matched) {
      setAppliedVoucher(matched);
      setVoucherInput('');
      toast.success(`Áp dụng mã "${code}" thành công!`, {
        description: matched.title,
      });
    } else {
      toast.error(`Mã ưu đãi "${code}" không hợp lệ hoặc đã hết hạn.`);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    toast.info('Đã hủy áp dụng mã giảm giá');
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để hoàn tất hợp đồng thuê', {
        description: 'Các sản phẩm trong giỏ thuê của bạn sẽ được giữ nguyên.',
      });
      setIsOpen(false);
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Giỏ đồ thuê đang trống!');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      items.forEach((item) => {
        const itemRentalCost = item.product.pricePerDay * item.days;
        const ratio = rawSubtotal > 0 ? itemRentalCost / rawSubtotal : 1;
        const itemDiscount = Math.round(discountAmount * ratio);
        const itemFinalPrice = Math.max(0, itemRentalCost - itemDiscount);

        addContract({
          contractCode: `HD-${Math.floor(1000 + Math.random() * 9000)}`,
          product: item.product,
          customer: user || { 
            id: 'c-1', 
            name: 'Khách hàng', 
            email: 'customer@example.com', 
            roles: ['CUSTOMER'], 
            customerTier: 'C1',
            createdAt: now.toISOString(),
          },
          merchantId: item.product.merchant.id,
          startDate: now.toISOString(),
          endDate: new Date(now.getTime() + item.days * 86400000).toISOString(),
          totalDays: item.days,
          rentalFee: itemFinalPrice,
          depositAmount: Math.round(item.product.depositAmount * depositRate),
          deliveryFee: 0,
          totalAmount: itemFinalPrice + Math.round(item.product.depositAmount * depositRate),
        });
      });

      clearCart();
      setAppliedVoucher(null);
      setIsOpen(false);

      toast.success('🎉 Đặt thuê thành công!', {
        description: `Đã tạo ${items.length} hợp đồng thuê. Đối tác sẽ sớm liên hệ xác nhận bàn giao.`,
        duration: 5000,
      });

      navigate('/account');
    } catch {
      toast.error('Đã xảy ra lỗi khi tạo hợp đồng thuê. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsOpen(false)} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Giỏ đồ thuê</h2>
                <span className="text-xs text-gray-500">{items.length} thiết bị đã chọn</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-300 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Giỏ thuê đang trống</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                  Chọn máy ảnh, flycam, trang phục dạ hội hoặc ô tô điện từ danh mục để bắt đầu thuê ngay.
                </p>
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/catalog');
                  }}
                  className="rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
                >
                  Khám phá đồ thuê
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-200 transition-all"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 pr-1">
                          <Link
                            to={`/products/${item.product.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-gray-900 hover:text-primary-600 line-clamp-1 block"
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-[10px] text-gray-400 block truncate mt-0.5">
                            Đối tác: {item.product.merchant.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                          title="Xóa món này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Days Counter */}
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-0.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateDays(item.product.id, item.days - 1)}
                            className="text-gray-500 hover:text-gray-900 cursor-pointer disabled:opacity-30"
                            disabled={item.days <= 1}
                            aria-label="Giảm số ngày"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-800 px-1">{item.days} ngày</span>
                          <button
                            type="button"
                            onClick={() => updateDays(item.product.id, item.days + 1)}
                            className="text-gray-500 hover:text-gray-900 cursor-pointer"
                            aria-label="Tăng số ngày"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-primary-600 block">
                            {formatCurrency(item.product.pricePerDay * item.days)}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({formatCurrency(item.product.pricePerDay)}/ngày)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* VOUCHER / COUPON SECTION */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-amber-600" />
                        Mã khuyến mãi & Voucher
                      </span>
                      {appliedVoucher && (
                        <button
                          type="button"
                          onClick={handleRemoveVoucher}
                          className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Gỡ bỏ
                        </button>
                      )}
                    </div>

                    {appliedVoucher ? (
                      <div className="p-2 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-emerald-800 block">
                              {appliedVoucher.code}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {appliedVoucher.title}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          -{formatCurrency(discountAmount)}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={voucherInput}
                            onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyVoucher();
                              }
                            }}
                            placeholder="Nhập mã (VD: RENTHUB50K)"
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs uppercase font-mono font-semibold placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-amber-400"
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleApplyVoucher()}
                            className="rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer px-3"
                          >
                            Áp dụng
                          </Button>
                        </div>

                        {/* Quick suggestions */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {QUICK_COUPONS.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleApplyVoucher(c.code)}
                              className="px-2 py-0.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              + {c.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 space-y-3.5">
              
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Tạm tính thuê đồ:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(rawSubtotal)}</span>
                </div>

                {appliedVoucher && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Ưu đãi voucher ({appliedVoucher.code}):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1">
                    Tiền cọc bảo chứng:
                    <span className="text-[10px] bg-primary-50 text-primary-700 px-1 py-0.2 rounded font-bold">
                      {Math.round(depositRate * 100)}%
                    </span>
                  </span>
                  <span className="font-semibold text-gray-800">{formatCurrency(totalDeposit)}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-600">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Bảo hiểm thiết bị RentGuard:
                  </span>
                  <span className="font-bold">Miễn phí</span>
                </div>

                {/* Assurance note */}
                <div className="flex items-start gap-1 text-[10px] text-gray-400 bg-white p-2 rounded-xl border border-gray-100 mt-1">
                  <Info className="h-3.5 w-3.5 text-primary-500 shrink-0 mt-0.5" />
                  <span>Tiền cọc bảo chứng được hoàn lại 100% ngay sau khi hoàn tất trả đồ.</span>
                </div>

                {/* Final Total */}
                <div className="flex items-center justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <div>
                    <span>Tổng thanh toán:</span>
                    <span className="block text-[10px] font-normal text-gray-400">Đã bao gồm tiền cọc</span>
                  </div>
                  <span className="text-base text-primary-600 font-black">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-12 gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="col-span-4 rounded-xl border-gray-200 text-gray-600 hover:text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
                >
                  Xóa giỏ
                </Button>

                <Button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="col-span-8 rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Đang xử lý...</span>
                  ) : (
                    <>
                      <span>{isAuthenticated ? 'Xác nhận thuê ngay' : 'Đăng nhập để thuê'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
