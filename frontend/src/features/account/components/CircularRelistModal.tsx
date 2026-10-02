import { useState } from 'react';
import { RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { mockActiveRentals } from '../account.mock';
import { toast } from 'sonner';

interface CircularRelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CircularRelistModal({ isOpen, onClose, onSuccess }: CircularRelistModalProps) {
  const [selectedRentalId, setSelectedRentalId] = useState(mockActiveRentals[0]?.id || '');
  const [dailyPrice, setDailyPrice] = useState('750000');
  const [startDate, setStartDate] = useState('2026-09-25');
  const [endDate, setEndDate] = useState('2026-09-27');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentRental = mockActiveRentals.find(r => r.id === selectedRentalId) || mockActiveRentals[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('Vui lòng đồng ý với điều khoản bảo hiểm tuần hoàn RentHub');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đã đăng "Chuyển đồ thuê" lên sàn thành công!', {
        description: `Sản phẩm ${currentRental?.productName} đã được niêm yết với giá ${formatCurrency(Number(dailyPrice))}/ngày.`,
      });
      onSuccess?.();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50/50 via-white to-secondary-50/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/20">
              <RefreshCw className="h-5 w-5 animate-spin-reverse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                🔄 Chuyển đồ thuê Tuần hoàn
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                  Circular Rent
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Cho thuê lại đồ đang mượn trong những ngày trống để bù chi phí
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Select Item Currently In Renting In */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">
              Chọn thiết bị đang thuê cần chuyển tiếp:
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {mockActiveRentals.filter(r => r.status === 'ACTIVE').map((rental) => {
                const isSelected = rental.id === selectedRentalId;
                return (
                  <div
                    key={rental.id}
                    onClick={() => {
                      setSelectedRentalId(rental.id);
                      setDailyPrice(String(Math.round(rental.dailyRate * 0.9)));
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/40 ring-2 ring-primary-500/20'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <img
                      src={rental.productImage}
                      alt={rental.productName}
                      className="h-14 w-14 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {rental.productName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium">
                          {rental.contractCode}
                        </span>
                        <span>• Hạn thuê gốc: {rental.endDate}</span>
                      </div>
                      <div className="text-xs text-primary-600 font-semibold mt-1">
                        Giá thuê gốc: {formatCurrency(rental.dailyRate)}/ngày
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Giá cho thuê lại (VNĐ/ngày)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={dailyPrice}
                  onChange={(e) => setDailyPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="750000"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">
                  ₫/ngày
                </span>
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent-500" />
                Gợi ý: 90% giá gốc giúp có khách trong 2h
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Kỳ hạn cho thuê khả dụng
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                <span className="text-xs text-gray-400">→</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500">
                Phải nằm trong thời hạn hợp đồng đang thuê
              </p>
            </div>
          </div>

          {/* Guaranteed Protection Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-1">
              <span className="font-bold">Đặc quyền Bảo chứng Ký quỹ kép (Circular SLA)</span>
              <p className="text-emerald-700 leading-relaxed">
                Người thuê sau bắt buộc ký quỹ 100% tiền cọc và thực hiện kiểm tra E-Audit lúc nhận và trả. Nếu phát sinh sự cố, bảo hiểm RentHub Care chi trả bồi hoàn trực tiếp cho Merchant gốc.
              </p>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
            />
            <span>
              Tôi cam kết giữ gìn thiết bị và đồng ý ủy quyền cho RentHub quản lý cọc trung gian chuyển tiếp theo quy chuẩn kinh tế tuần hoàn.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy bỏ
            </Button>
            <Button type="submit" loading={isSubmitting} className="bg-primary-600 hover:bg-primary-700">
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Đăng chuyển tiếp ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
