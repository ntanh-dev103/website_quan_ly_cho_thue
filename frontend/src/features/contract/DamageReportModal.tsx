import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ImageDropzone } from '@/shared/ui/ImageDropzone';
import { formatCurrency } from '@/shared/lib/utils';
import type { Contract } from '@/entities/contract/contract.types';
import { toast } from 'sonner';

interface DamageReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
}

export function DamageReportModal({ isOpen, onClose, contract }: DamageReportModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [handlingType, setHandlingType] = useState<'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND'>('FULL_REFUND');
  const [deductedAmount, setDeductedAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handlingType !== 'FULL_REFUND' && images.length === 0) {
      toast.error('Vui lòng tải lên hình ảnh bằng chứng hư hỏng!');
      return;
    }
    if (handlingType === 'PARTIAL_REFUND' && deductedAmount <= 0) {
      toast.error('Vui lòng nhập số tiền cọc muốn giữ lại hợp lệ!');
      return;
    }
    
    toast.success('Gửi báo cáo hư hỏng thành công!');
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()} title="Báo cáo tình trạng hàng trả về">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-500">Mã đơn: </span>
            <span className="font-semibold text-gray-900">{contract.contractCode}</span>
          </div>
          <div>
            <span className="text-gray-500">Tiền cọc: </span>
            <span className="font-semibold text-primary-600">{formatCurrency(contract.depositAmount)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Mô tả tình trạng (nếu có vấn đề)</Label>
          <textarea
            className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-y"
            placeholder="Ví dụ: Trầy xước mặt kính, thiếu phụ kiện..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Bằng chứng hình ảnh</Label>
          <ImageDropzone maxFiles={5} value={images} onChange={setImages} />
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Label>Phương án xử lý tiền cọc</Label>
          
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="radio" 
                name="handling" 
                checked={handlingType === 'FULL_REFUND'} 
                onChange={() => { setHandlingType('FULL_REFUND'); setDeductedAmount(0); }}
                className="w-4 h-4 text-primary-600 focus:ring-primary-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Hàng nguyên vẹn - Hoàn trả toàn bộ cọc</p>
                <p className="text-xs text-gray-500 mt-0.5">Hoàn lại {formatCurrency(contract.depositAmount)} cho người thuê</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="radio" 
                name="handling" 
                checked={handlingType === 'PARTIAL_REFUND'} 
                onChange={() => setHandlingType('PARTIAL_REFUND')}
                className="w-4 h-4 text-primary-600 focus:ring-primary-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Hư hỏng nhẹ - Trừ một phần cọc</p>
                <p className="text-xs text-gray-500 mt-0.5">Yêu cầu thương lượng và bằng chứng</p>
              </div>
            </label>

            {handlingType === 'PARTIAL_REFUND' && (
              <div className="pl-10 pr-4 pb-2 animate-fade-in">
                <Label className="text-xs text-gray-500 mb-2 block">Số tiền muốn GIỮ LẠI (trừ vào cọc)</Label>
                <Input 
                  type="number" 
                  max={contract.depositAmount}
                  value={deductedAmount}
                  onChange={(e) => setDeductedAmount(Number(e.target.value))}
                  className="h-9 text-sm"
                  placeholder="Nhập số tiền..."
                />
              </div>
            )}

            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input 
                type="radio" 
                name="handling" 
                checked={handlingType === 'NO_REFUND'} 
                onChange={() => { setHandlingType('NO_REFUND'); setDeductedAmount(contract.depositAmount); }}
                className="w-4 h-4 text-primary-600 focus:ring-primary-600"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm text-red-600">Hư hỏng nặng/Mất tích - Giữ toàn bộ cọc</p>
                <p className="text-xs text-gray-500 mt-0.5">Admin sẽ xem xét bằng chứng trước khi duyệt</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit" className={handlingType === 'NO_REFUND' ? 'bg-red-600 hover:bg-red-700' : ''}>
            Xác nhận báo cáo
          </Button>
        </div>
      </form>
    </Modal>
  );
}
