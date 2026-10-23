import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Wrench 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import type { Contract } from '@/entities/contract/contract.types';
import { toast } from 'sonner';

interface DamageAssessmentModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (contractId: string, compensationFee: number, notes: string) => Promise<void> | void;
}

export function DamageAssessmentModal({
  contract,
  isOpen,
  onClose,
  onConfirm,
}: DamageAssessmentModalProps) {
  const [condition, setCondition] = useState<'GOOD' | 'DAMAGED'>('GOOD');
  const [damageDescription, setDamageDescription] = useState('');
  const [compensationFee, setCompensationFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !contract) return null;

  const depositHeld = contract.depositAmount || 0;
  const actualCompensation = condition === 'DAMAGED' ? Math.max(0, compensationFee) : 0;
  const refundAmount = Math.max(0, depositHeld - actualCompensation);
  const additionalDebt = actualCompensation > depositHeld ? actualCompensation - depositHeld : 0;

  const handleSubmit = async () => {
    if (condition === 'DAMAGED' && !damageDescription.trim()) {
      toast.error('Vui lòng mô tả tình trạng hư hại của thiết bị!');
      return;
    }

    setIsSubmitting(true);
    try {
      const notes = condition === 'GOOD' 
        ? 'Thiết bị nguyên vẹn, hoạt động hoàn hảo. Hoàn trả 100% tiền cọc.' 
        : damageDescription;

      await onConfirm(contract.id, actualCompensation, notes);
      toast.success('Đã hoàn tất thẩm định hư hại & thanh quyết toán cọc!', {
        description: refundAmount > 0 
          ? `Số tiền ${formatCurrency(refundAmount)} sẽ được hoàn tự động về ví khách hàng.`
          : 'Tiền cọc đã được khấu trừ toàn bộ cho chi phí bồi thường.',
      });
      onClose();
    } catch {
      toast.error('Có lỗi xảy ra khi lưu biên bản thẩm định!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Biên Bản Thẩm Định Hiện Trạng & Hoàn Cọc</h3>
              <p className="text-xs text-gray-400">
                HĐ: <span className="text-amber-400 font-mono">{contract.contractCode}</span> • {contract.product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
          
          {/* Tình trạng thiết bị */}
          <div className="space-y-2">
            <label className="font-bold text-gray-900 block text-xs uppercase tracking-wide">
              1. Kết quả kiểm tra thiết bị khi thu hồi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCondition('GOOD');
                  setCompensationFee(0);
                  setDamageDescription('');
                }}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  condition === 'GOOD'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <CheckCircle2 className={`h-5 w-5 shrink-0 ${condition === 'GOOD' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <div>
                  <p className="font-bold text-xs">Hoàn hảo, nguyên vẹn</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Không trầy xước, đầy đủ phụ kiện. Đủ điều kiện hoàn cọc 100%.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCondition('DAMAGED');
                  if (compensationFee === 0) setCompensationFee(Math.round(depositHeld * 0.3));
                }}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  condition === 'DAMAGED'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <AlertTriangle className={`h-5 w-5 shrink-0 ${condition === 'DAMAGED' ? 'text-amber-600' : 'text-gray-400'}`} />
                <div>
                  <p className="font-bold text-xs">Phát sinh hư hại / Thiếu đồ</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Có va đập, nứt vỡ hoặc thiếu phụ kiện cần bồi thường.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Form chi tiết hư hại nếu chọn DAMAGED */}
          {condition === 'DAMAGED' && (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3 animate-fade-in">
              <div>
                <label className="font-bold text-gray-900 block mb-1">
                  Mô tả chi tiết hư hại hoặc linh kiện thất lạc:
                </label>
                <textarea
                  rows={2}
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  placeholder="Ví dụ: Vỡ kính bảo vệ filter ống kính, xước sâu thân máy bên phải, mất dây cáp Type-C zin..."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-gray-900 block mb-1">
                  Số tiền phạt bồi thường sửa chữa (VNĐ):
                </label>
                <input
                  type="number"
                  step="50000"
                  min="0"
                  value={compensationFee}
                  onChange={(e) => setCompensationFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                />
              </div>
            </div>
          )}

          {/* Bảng Quyết toán cọc */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="font-bold text-gray-900 text-xs uppercase tracking-wide">
              2. Quyết toán tài chính ký quỹ
            </p>
            
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tiền cọc thiết bị đang giữ trong Escrow:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(depositHeld)}</span>
              </div>

              <div className="flex justify-between text-amber-700">
                <span>Khấu trừ bồi thường hư hại & chi phí sửa chữa:</span>
                <span className="font-semibold text-amber-800">-{formatCurrency(actualCompensation)}</span>
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold">
                <span className="text-gray-900">Số tiền cọc hoàn trả lại Khách hàng:</span>
                <span className="text-emerald-600 font-extrabold text-base">
                  {formatCurrency(refundAmount)}
                </span>
              </div>

              {additionalDebt > 0 && (
                <div className="p-2 bg-red-50 text-red-700 rounded border border-red-200 text-[11px] font-semibold">
                  ⚠️ Chi phí hư hại vượt mức cọc {formatCurrency(additionalDebt)}. Hệ thống sẽ ghi nhận công nợ bồi thường bổ sung đối với khách hàng.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold"
          >
            {isSubmitting ? 'Đang quyết toán...' : 'Xác Nhận Biên Bản & Hoàn Cọc'}
          </Button>
        </div>

      </div>
    </div>
  );
}
