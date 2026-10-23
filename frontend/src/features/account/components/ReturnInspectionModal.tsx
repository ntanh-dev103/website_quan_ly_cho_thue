import { useState } from 'react';
import { Camera, CheckCircle2, Truck, ShieldCheck, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { EAuditUploader } from '@/shared/ui/EAuditUploader';
import { formatCurrency } from '@/shared/lib/utils';
import type { ActiveRental } from '../account.types';
import { toast } from 'sonner';

interface ReturnInspectionModalProps {
  rental: ActiveRental | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (rentalId: string) => void;
}

export function ReturnInspectionModal({
  rental,
  isOpen,
  onClose,
  onSuccess,
}: ReturnInspectionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [auditImage, setAuditImage] = useState<File | null>(null);
  const [returnMethod, setReturnMethod] = useState<'DIRECT' | 'EXPRESS'>('EXPRESS');
  const [returnAddress, setReturnAddress] = useState('Số 45, Đường Lê Duẩn, Quận 1, TP. HCM');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !rental) return null;

  const handleNextStep = () => {
    if (step === 1 && !auditImage) {
      toast.error('Vui lòng chụp hoặc tải ảnh kiểm tra thiết bị trước khi tiếp tục!');
      return;
    }
    if (step < 3) {
      setStep((prev) => (prev + 1) as 2 | 3);
    }
  };

  const handleConfirmReturn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Yêu cầu trả hàng đã được gửi thành công!', {
        description: `Mã HĐ ${rental.contractCode}: Tiền cọc ${formatCurrency(rental.depositAmount)} sẽ được hoàn tự động sau khi Merchant xác nhận kiểm tra hoàn tất.`,
      });
      onSuccess?.(rental.id);
      onClose();
      setStep(1);
      setAuditImage(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Quy trình Trả hàng & E-Audit Chứng thực
              </h3>
              <p className="text-xs text-gray-500">
                Hợp đồng: <span className="font-semibold text-gray-700">{rental.contractCode}</span> • {rental.productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                1
              </div>
              <span className={`text-xs font-semibold ${step >= 1 ? 'text-primary-700' : 'text-gray-400'}`}>
                ProofCamera E-Audit
              </span>
            </div>
            <div className="w-10 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-xs font-semibold ${step >= 2 ? 'text-primary-700' : 'text-gray-400'}`}>
                Phương thức bàn giao
              </span>
            </div>
            <div className="w-10 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-xs font-semibold ${step >= 3 ? 'text-primary-700' : 'text-gray-400'}`}>
                Hoàn trả cọc Escrow
              </span>
            </div>
          </div>
        </div>

        {/* Body based on active step */}
        <div className="p-6 overflow-y-auto space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Quy định E-Audit Chứng thực hiện trạng:
                </span>
                Vui lòng chụp ảnh rõ nét toàn bộ thân máy/thiết bị lúc bàn giao. Hình ảnh sẽ được nén tự động qua Web Worker (&lt;500KB) và gắn mã băm bất biến nhằm làm căn cứ giải tỏa 100% cọc Escrow.
              </div>

              {/* Product quick pill */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <img
                  src={rental.productImage}
                  alt={rental.productName}
                  className="h-12 w-12 rounded-lg object-cover bg-white"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-gray-900 truncate">{rental.productName}</p>
                  <p className="text-gray-500">Đối tác: {rental.merchantName}</p>
                  <p className="text-emerald-600 font-semibold mt-0.5">
                    Tiền cọc giữ: {formatCurrency(rental.depositAmount)}
                  </p>
                </div>
              </div>

              {/* ProofCamera Web Worker Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  E-Audit ProofCamera (Nén ảnh nền bằng Web Worker)
                </label>
                <EAuditUploader
                  onUpload={(file) => {
                    setAuditImage(file);
                    toast.success('Đã tải và tối ưu hóa ảnh thành công!');
                  }}
                  maxSizeMB={0.5}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Ghi chú về tình trạng thiết bị (nếu có):
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Thiết bị hoạt động hoàn hảo, đã vệ sinh sạch sẽ, đầy đủ phụ kiện zin kèm theo..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-800 block">
                Chọn hình thức bàn giao trả thiết bị:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setReturnMethod('EXPRESS')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    returnMethod === 'EXPRESS'
                      ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary-600" />
                      <span className="font-bold text-sm text-gray-900">RentHub Express</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Shipper có chứng chỉ kiểm định thiết bị công nghệ đến tận nơi nhận hàng trong 2h.
                  </p>
                  <p className="text-xs text-primary-600 font-semibold mt-2">
                    Phí dịch vụ: 0 ₫ (Miễn phí)
                  </p>
                </div>

                <div
                  onClick={() => setReturnMethod('DIRECT')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    returnMethod === 'DIRECT'
                      ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-600" />
                    <span className="font-bold text-sm text-gray-900">Tự mang tới Merchant</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Bạn tự mang thiết bị đến cơ sở của {rental.merchantName} để bàn giao trực tiếp.
                  </p>
                  <p className="text-xs text-gray-500 font-semibold mt-2">
                    Thời gian: 08:30 - 20:00 hàng ngày
                  </p>
                </div>
              </div>

              {returnMethod === 'EXPRESS' && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <label className="font-semibold text-gray-700 block">
                    Địa chỉ Shipper đến lấy hàng:
                  </label>
                  <input
                    type="text"
                    value={returnAddress}
                    onChange={(e) => setReturnAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                  />
                  <p className="text-gray-400 text-[11px] pt-1">
                    Shipper sẽ gọi trước khi đến 15 phút. Vui lòng đóng gói cẩn thận.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold text-gray-900">
                  Xác nhận Hoàn trả Cọc Escrow
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Khoản tiền cọc của bạn được bảo hộ bởi ngân hàng liên kết và hợp đồng thông minh.
                </p>
              </div>

              {/* Financial Breakdown Card */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Tiền cọc ban đầu:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(rental.depositAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Khấu trừ hư hao:</span>
                  <span className="font-semibold text-emerald-600">0 ₫ (Không phát hiện)</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>Phí hoàn tất thủ tục:</span>
                  <span className="font-semibold text-emerald-600">0 ₫ (Miễn phí)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-900">Tổng cọc thực nhận hoàn trả:</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    {formatCurrency(rental.depositAmount)}
                  </span>
                </div>
              </div>

              {/* SLA Escrow explanation */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Quy tắc Escrow SLA 24h - 48h:</span> Tiền cọc sẽ tự động giải tỏa vào <strong>Số dư khả dụng</strong> của bạn ngay khi Merchant ký nhận bàn giao, hoặc tối đa 48h nếu Merchant không có khiếu nại.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              disabled={isSubmitting}
            >
              Quay lại
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Đóng
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={handleNextStep} className="bg-primary-600 hover:bg-primary-700">
                Tiếp theo <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                loading={isSubmitting}
                onClick={handleConfirmReturn}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Xác nhận gửi trả hàng & Hoàn cọc
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
