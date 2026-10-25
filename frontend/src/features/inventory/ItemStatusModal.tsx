import { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { merchantApi, type ProductItemDto } from '@/api/merchant.api';
import { toast } from 'sonner';
import { AlertTriangle, Wrench, CheckCircle2, Archive, MapPin } from 'lucide-react';

interface ItemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProductItemDto | null;
  onItemUpdated?: (updated: ProductItemDto) => void;
}

export function ItemStatusModal({ isOpen, onClose, item, onItemUpdated }: ItemStatusModalProps) {
  const [status, setStatus] = useState<'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED' | 'RETIRED'>('AVAILABLE');
  const [conditionScore, setConditionScore] = useState<number>(100);
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setConditionScore(item.conditionScore || 100);
      setWarehouseLocation(item.warehouseLocation || '');
      setNotes(item.notes || '');
    }
  }, [item]);

  if (!item) return null;

  const isRented = item.status === 'RENTED';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRented) {
      toast.error('Thiết bị đang cho thuê, không thể thay đổi trạng thái thủ công');
      return;
    }

    try {
      setLoading(true);
      const updated = await merchantApi.updateItemStatus(item.id, {
        status,
        conditionScore,
        warehouseLocation: warehouseLocation.trim(),
        notes: notes.trim(),
      });
      toast.success(`Đã cập nhật trạng thái thiết bị [${item.serialNumber || item.skuCode}]`);
      if (onItemUpdated) {
        onItemUpdated(updated);
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Có lỗi khi cập nhật thiết bị';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Cập nhật trạng thái thiết bị vật lý"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Header Info */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-800">SKU: {item.skuCode}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              item.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
              item.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
              item.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' :
              'bg-slate-200 text-slate-700'
            }`}>
              {item.status}
            </span>
          </div>
          {item.serialNumber && (
            <p className="text-xs text-slate-600">
              <span className="font-medium text-slate-500">Serial/IMEI:</span> {item.serialNumber}
            </p>
          )}
          {item.barcode && (
            <p className="text-xs text-slate-600">
              <span className="font-medium text-slate-500">Mã vạch:</span> {item.barcode}
            </p>
          )}
        </div>

        {/* Invariant Warning if Rented */}
        {isRented && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Thiết bị đang nằm trong hợp đồng thuê đang hoạt động</p>
              <p className="text-blue-700 mt-0.5">
                Trạng thái thiết bị sẽ tự động chuyển về Sẵn sàng (hoặc Hư hỏng) sau khi khách hoàn trả và biên bản thẩm định được ký kết.
              </p>
            </div>
          </div>
        )}

        {/* Status Selection Cards */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-700">Chọn trạng thái vận hành:</Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isRented}
              onClick={() => setStatus('AVAILABLE')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs ${
                status === 'AVAILABLE'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-400/30'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              } ${isRented ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Sẵn sàng (Available)</span>
            </button>

            <button
              type="button"
              disabled={isRented}
              onClick={() => setStatus('MAINTENANCE')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs ${
                status === 'MAINTENANCE'
                  ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold ring-2 ring-amber-400/30'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              } ${isRented ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Wrench className="h-4 w-4 text-amber-600" />
              <span>Bảo trì (Maintenance)</span>
            </button>

            <button
              type="button"
              disabled={isRented}
              onClick={() => setStatus('RETIRED')}
              className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 text-xs ${
                status === 'RETIRED'
                  ? 'border-slate-500 bg-slate-100 text-slate-800 font-bold ring-2 ring-slate-400/30'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              } ${isRented ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Archive className="h-4 w-4 text-slate-500" />
              <span>Ngừng cho thuê (Retired)</span>
            </button>
          </div>
        </div>

        {/* Warehouse Location */}
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-rose-600" />
            Vị trí kho
          </Label>
          <Input
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
            placeholder="VD: Kho Hà Nội - Tầng 2 Kệ B3"
            className="text-xs"
          />
        </div>

        {/* Condition Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <Label className="font-semibold text-slate-700">Điểm tình trạng (% Condition):</Label>
            <span className="font-bold text-primary-600">{conditionScore}/100</span>
          </div>
          <input
            type="range"
            min={30}
            max={100}
            value={conditionScore}
            onChange={(e) => setConditionScore(Number(e.target.value))}
            className="w-full accent-primary-600 cursor-pointer"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700">Lịch sử bảo trì / Ghi chú</Label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lý do bảo dưỡng, linh kiện thay thế, v.v."
            className="text-xs"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="text-xs">
            Đóng
          </Button>
          {!isRented && (
            <Button type="submit" disabled={loading} className="text-xs font-bold bg-primary-600 hover:bg-primary-700">
              {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
