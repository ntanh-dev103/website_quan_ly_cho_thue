import { useState, useRef, useEffect } from 'react';
import { 
  Tag, 
  Sparkles, 
  Copy, 
  Check, 
  Flame, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export interface VoucherItem {
  code: string;
  discountTitle: string;
  description: string;
  minOrder: string;
  expiry: string;
  badge?: string;
  type: 'fixed' | 'percent' | 'shipping';
  discountAmount: number;
}

export const ACTIVE_VOUCHERS: VoucherItem[] = [
  {
    code: 'RENTHUB50K',
    discountTitle: 'Giảm 50.000đ',
    description: 'Áp dụng cho đơn thuê thiết bị đầu tiên',
    minOrder: 'Đơn từ 300.000đ',
    expiry: 'Hạn: 31/10/2026',
    badge: 'HOT DEAL',
    type: 'fixed',
    discountAmount: 50000,
  },
  {
    code: 'FREESHIP',
    discountTitle: 'Miễn phí vận chuyển 2 chiều',
    description: 'Giao & nhận tận nơi nội thành TP.HCM & Hà Nội',
    minOrder: 'Đơn từ 1.000.000đ',
    expiry: 'Hạn: Hàng tuần',
    badge: 'FREESHIP',
    type: 'shipping',
    discountAmount: 40000,
  },
  {
    code: 'WEEKEND20',
    discountTitle: 'Giảm 20% trọn gói',
    description: 'Áp dụng khi thuê cuối tuần (Thứ 6 - Chủ Nhật) từ 3 ngày',
    minOrder: 'Tối đa giảm 300.000đ',
    expiry: 'Hạn: 30/11/2026',
    badge: 'CUỐI TUẦN',
    type: 'percent',
    discountAmount: 0.2,
  },
  {
    code: 'TIERVIP10',
    discountTitle: 'Giảm 10% đặc quyền',
    description: 'Dành riêng cho thành viên hạng Pro / VIP RentHub',
    minOrder: 'Không giới hạn giá trị',
    expiry: 'Vô thời hạn',
    type: 'percent',
    discountAmount: 0.1,
  },
];

export function PromotionsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã "${code}"!`, {
      description: 'Nhập mã này tại giỏ hàng thuê để nhận ưu đãi ngay.',
      duration: 3000,
    });
    setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2500);
  };

  return (
    <div ref={popoverRef} className="relative inline-block">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          isOpen
            ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 shadow-2xs'
            : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50/60'
        }`}
        aria-label="Khuyến mãi & Mã giảm giá"
        aria-expanded={isOpen}
      >
        <Tag className="h-3.5 w-3.5 text-amber-500 fill-amber-100" />
        <span className="hidden sm:inline">Khuyến mãi</span>
        <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
          Hot
        </span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 top-[calc(100%+8px)] w-[340px] sm:w-[390px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-gray-200/90 shadow-2xl shadow-gray-900/15 p-3.5 sm:p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                  Mã Giảm Giá & Ưu Đãi
                </h3>
                <p className="text-[11px] text-gray-500">Sao chép mã áp dụng ngay tại giỏ đồ thuê</p>
              </div>
            </div>
          </div>

          {/* Banner Promo */}
          <div className="my-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-amber-900 block truncate">
                  Thuê càng lâu, Giảm càng sâu!
                </span>
                <span className="text-[10px] text-amber-700 block">
                  Tiết kiệm đến 30% khi thuê theo tuần hoặc tháng
                </span>
              </div>
            </div>
            <Link
              to="/catalog"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-amber-800 bg-white/80 hover:bg-white px-2 py-1 rounded-md shrink-0 shadow-2xs border border-amber-200 transition-colors"
            >
              Xem ngay
            </Link>
          </div>

          {/* Voucher List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-0.5">
            {ACTIVE_VOUCHERS.map((v) => {
              const isCopied = copiedCode === v.code;
              return (
                <div
                  key={v.code}
                  className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-amber-200 hover:shadow-xs transition-all relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-extrabold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md font-mono tracking-wide">
                          {v.code}
                        </span>
                        {v.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                            {v.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-gray-900 mt-1">
                        {v.discountTitle}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                        {v.description}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                        <span>• {v.minOrder}</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="h-3 w-3" />
                          {v.expiry}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(v.code, e)}
                      className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Lấy mã</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-gray-400">Ưu đãi cập nhật liên tục</span>
            <Link
              to="/catalog"
              onClick={() => setIsOpen(false)}
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 hover:underline text-[11px]"
            >
              <span>Khám phá đồ thuê hot</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
