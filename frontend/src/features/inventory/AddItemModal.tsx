import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { merchantApi, type ProductItemDto } from '@/api/merchant.api';
import { toast } from 'sonner';
import { QrCode, Cpu, MapPin, Gauge } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  onItemAdded?: (item: ProductItemDto) => void;
}

export function AddItemModal({ isOpen, onClose, productId, productName, onItemAdded }: AddItemModalProps) {
  const [skuCode, setSkuCode] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [conditionScore, setConditionScore] = useState<number>(100);
  const [warehouseLocation, setWarehouseLocation] = useState('Kho trung tâm - Kệ A1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber.trim()) {
      toast.error('Vui lòng nhập số Serial / IMEI của thiết bị');
      return;
    }

    try {
      setLoading(true);
      const created = await merchantApi.createProductItem(productId, {
        skuCode: skuCode.trim() || undefined,
        serialNumber: serialNumber.trim(),
        barcode: barcode.trim() || undefined,
        conditionScore,
        warehouseLocation: warehouseLocation.trim(),
        notes: notes.trim() || undefined,
        status: 'AVAILABLE',
      });
      toast.success(`Đã thêm thiết bị [${created.serialNumber || created.skuCode}] vào kho!`);
      if (onItemAdded) {
        onItemAdded(created);
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi thêm thiết bị vào kho';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getConditionLabel = (score: number) => {
    if (score >= 95) return { text: 'Mới 99% / Nguyên bản', color: 'text-emerald-700 bg-emerald-50' };
    if (score >= 85) return { text: 'Rất tốt (Like New)', color: 'text-blue-700 bg-blue-50' };
    if (score >= 70) return { text: 'Tốt (Có xước nhẹ)', color: 'text-amber-700 bg-amber-50' };
    return { text: 'Khá / Cần lưu ý', color: 'text-rose-700 bg-rose-50' };
  };

  const cond = getConditionLabel(conditionScore);

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Nhập thiết bị vật lý vào kho (Product Item)"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500">Sản phẩm cha (Master SKU):</p>
          <p className="font-bold text-slate-900 text-sm">{productName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Cpu className="h-3.5 w-3.5 text-primary-600" />
              Số Serial / IMEI *
            </Label>
            <Input
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="VD: SN-2024-MAC-8842"
              className="text-xs"
            />
            <p className="text-[10px] text-slate-400">Định danh duy nhất của thiết bị vật lý</p>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <QrCode className="h-3.5 w-3.5 text-slate-600" />
              Mã vạch / Barcode
            </Label>
            <Input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="VD: 8938501234567"
              className="text-xs"
            />
            <p className="text-[10px] text-slate-400">Dùng để quét mã bàn giao và trả hàng nhanh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Mã SKU con (Tùy chọn)</Label>
            <Input
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              placeholder="Tự động sinh nếu để trống"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-rose-600" />
              Vị trí lưu kho
            </Label>
            <Input
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              placeholder="VD: Kho Hà Nội - Tầng 2 Kệ B3"
              className="text-xs"
            />
          </div>
        </div>

        {/* Condition Score Slider */}
        <div className="space-y-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-indigo-600" />
              Điểm tình trạng thiết bị (Condition Score):
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${cond.color}`}>
              {conditionScore}/100 • {cond.text}
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={conditionScore}
            onChange={(e) => setConditionScore(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>50 (Trung bình)</span>
            <span>75 (Tốt)</span>
            <span>90 (Like New)</span>
            <span>100 (Nguyên seal/Mới 100%)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700">Ghi chú phụ kiện & đặc điểm kỹ thuật</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="VD: Đủ sạc zin Type-C 96W, túi chống sốc, thân máy không trầy"
            className="text-xs"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="text-xs">
            Hủy
          </Button>
          <Button type="submit" disabled={loading} className="text-xs font-bold bg-primary-600 hover:bg-primary-700">
            {loading ? 'Đang lưu...' : 'Nhập máy vào kho'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
