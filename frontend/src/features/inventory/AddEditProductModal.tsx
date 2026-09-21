import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ImageDropzone } from '@/shared/ui/ImageDropzone';
import { categories } from '@/entities/product/product.mock';
import type { Product } from '@/entities/product/product.types';
import { toast } from 'sonner';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function AddEditProductModal({ isOpen, onClose, product }: AddEditProductModalProps) {
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [categoryId, setCategoryId] = useState(product?.categoryId || '');
  const [eavValues, setEavValues] = useState<Record<string, string>>(() => {
    const vals: Record<string, string> = {};
    if (product) {
      product.eavValues.forEach(e => vals[e.attributeId] = String(e.value));
    }
    return vals;
  });

  const activeCategory = categories.find(c => c.id === categoryId) || 
    categories.find(c => c.children?.some(sub => sub.id === categoryId))?.children?.find(sub => sub.id === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 ảnh sản phẩm');
      return;
    }
    toast.success(product ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Images */}
        <div className="space-y-2">
          <Label>Hình ảnh sản phẩm (Tối đa 8 ảnh)</Label>
          <ImageDropzone maxFiles={8} value={images} onChange={setImages} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tên sản phẩm *</Label>
            <Input required defaultValue={product?.name} placeholder="Nhập tên..." />
          </div>
          <div className="space-y-2">
            <Label>Danh mục *</Label>
            <select 
              required
              className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setEavValues({}); // Reset EAV when category changes
              }}
            >
              <option value="">Chọn danh mục</option>
              {categories.map(cat => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Giá thuê / ngày (VNĐ) *</Label>
            <Input required type="number" defaultValue={product?.pricePerDay} placeholder="Ví dụ: 100000" />
          </div>
          <div className="space-y-2">
            <Label>Giá trị tài sản / Tiền cọc gốc (VNĐ) *</Label>
            <Input required type="number" defaultValue={product?.depositAmount} placeholder="Dùng để tính cọc..." />
          </div>
        </div>

        {/* Dynamic EAV Form */}
        {activeCategory && activeCategory.availableAttributes.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm">Thông số chi tiết</h4>
            <div className="grid grid-cols-2 gap-4">
              {activeCategory.availableAttributes.map(attr => (
                <div key={attr.id} className="space-y-2">
                  <Label>{attr.name} {attr.unit && `(${attr.unit})`}</Label>
                  {attr.type === 'options' ? (
                    <select
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                      value={eavValues[attr.id] || ''}
                      onChange={(e) => setEavValues(prev => ({ ...prev, [attr.id]: e.target.value }))}
                    >
                      <option value="">Chọn...</option>
                      {attr.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input 
                      type={attr.type === 'number' ? 'number' : 'text'}
                      value={eavValues[attr.id] || ''}
                      onChange={(e) => setEavValues(prev => ({ ...prev, [attr.id]: e.target.value }))}
                      placeholder={`Nhập ${attr.name.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Mô tả sản phẩm</Label>
          <textarea
            className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-y"
            defaultValue={product?.description}
            placeholder="Mô tả tình trạng, yêu cầu đặc biệt..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
          <Button type="submit">{product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</Button>
        </div>
      </form>
    </Modal>
  );
}
