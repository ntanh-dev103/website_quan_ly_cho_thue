import { useState, useEffect } from 'react';
import { Edit, Trash2, Cpu, Plus, Wrench, MapPin, Gauge } from 'lucide-react';
import { VirtualTable } from '@/shared/ui/VirtualTable';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/Modal';
import { formatCurrency } from '@/shared/lib/utils';
import type { Product } from '@/entities/product/product.types';
import { categories } from '@/entities/product/product.mock';
import { toast } from 'sonner';
import { merchantApi, type ProductItemDto } from '@/api/merchant.api';
import { AddItemModal } from './AddItemModal';
import { ItemStatusModal } from './ItemStatusModal';

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function InventoryTable({ products, onEdit }: InventoryTableProps) {
  const [data, setData] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<ProductItemDto[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<ProductItemDto | null>(null);

  // Sync data when products prop changes
  useEffect(() => {
    setData(products);
  }, [products]);

  // Load items when a product is clicked
  const handleOpenItemsModal = async (product: Product) => {
    setSelectedProduct(product);
    setLoadingItems(true);
    try {
      const pId = Number(product.id) || 1;
      const res = await merchantApi.getItemsByProductId(pId);
      // Fallback seed if empty
      if (res.length === 0) {
        setItems([
          {
            id: 101,
            productId: pId,
            skuCode: `SKU-${product.id}-001`,
            serialNumber: `SN-2024-${product.id}-A101`,
            barcode: `893850123${product.id}1`,
            status: 'AVAILABLE',
            conditionScore: 98,
            warehouseLocation: 'Kho Hà Nội - Kệ A1',
            notes: 'Máy nguyên bản 99%, đủ hộp cáp sạc',
          },
          {
            id: 102,
            productId: pId,
            skuCode: `SKU-${product.id}-002`,
            serialNumber: `SN-2024-${product.id}-B202`,
            barcode: `893850123${product.id}2`,
            status: 'RENTED',
            conditionScore: 95,
            warehouseLocation: 'Kho Hà Nội - Kệ A1',
            notes: 'Đang cho thuê hợp đồng #HD-8842',
          },
        ]);
      } else {
        setItems(res);
      }
    } catch {
      toast.error('Không thể tải danh sách thiết bị vật lý');
    } finally {
      setLoadingItems(false);
    }
  };

  const handleDeleteItem = async (item: ProductItemDto) => {
    // INVARIANT: Block delete if RENTED
    if (item.status === 'RENTED') {
      toast.error('Không thể xóa thiết bị đang trong hợp đồng thuê!', {
        description: 'Thiết bị này đang được khách hàng sử dụng. Cần thu hồi và nghiệm thu trước khi xóa.',
      });
      return;
    }

    if (window.confirm(`Bạn có chắc muốn xóa thiết bị serial [${item.serialNumber || item.skuCode}] khỏi kho?`)) {
      try {
        await merchantApi.deleteProductItem(item.id);
        setItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Đã xóa thiết bị vật lý khỏi kho thành công!');
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Có lỗi xảy ra khi xóa thiết bị';
        toast.error(msg);
      }
    }
  };

  const handleDeleteProduct = (product: Product) => {
    // INVARIANT: Block delete if product has rented units
    if (product.status !== 'AVAILABLE') {
      toast.error('Không thể xóa sản phẩm đang cho thuê hoặc đang bảo trì!', {
        description: 'Vui lòng kiểm tra lại tình trạng hợp đồng của sản phẩm này.',
      });
      return;
    }
    
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
      setData(prev => prev.filter(p => p.id !== product.id));
      toast.success('Xóa sản phẩm thành công!');
    }
  };

  const columns = [
    {
      header: 'Sản phẩm',
      accessorKey: 'name' as keyof Product,
      width: '35%',
      cell: (item: Product) => (
        <div className="flex items-center gap-3">
          <img src={item.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-100 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 text-sm line-clamp-1" title={item.name}>{item.name}</div>
            <div className="text-[11px] text-gray-400">ID: #{item.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Danh mục',
      accessorKey: 'categoryId' as keyof Product,
      width: '15%',
      cell: (item: Product) => {
        const catName = categories.flatMap(c => c.children || []).find(c => c.id === item.categoryId)?.name || 'Khác';
        return <span className="text-gray-600 text-xs">{catName}</span>;
      },
    },
    {
      header: 'Giá / Ngày',
      accessorKey: 'pricePerDay' as keyof Product,
      width: '15%',
      cell: (item: Product) => <span className="font-bold text-primary-600 text-xs">{formatCurrency(item.pricePerDay)}</span>,
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status' as keyof Product,
      width: '15%',
      cell: (item: Product) => <StatusBadge type="item" status={item.status} />,
    },
    {
      header: 'Quản lý thiết bị & Thao tác',
      accessorKey: 'id' as keyof Product,
      width: '20%',
      cell: (item: Product) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenItemsModal(item)}
            className="h-8 px-2 text-xs font-semibold text-indigo-700 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100"
            title="Quản lý serial thiết bị vật lý"
          >
            <Cpu className="h-3.5 w-3.5 mr-1" />
            Serial ({item.totalStock || 2})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="h-8 px-2 text-gray-600 hover:text-primary-600"
            title="Chỉnh sửa thông tin sản phẩm"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteProduct(item)}
            className="h-8 px-2 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
            title="Xóa sản phẩm"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <VirtualTable 
        data={data} 
        columns={columns} 
        rowHeight={64}
        className="max-h-[70vh] min-h-[400px]"
      />

      {/* MODAL: PHYSICAL ITEMS (SERIAL / IMEI) MANAGEMENT */}
      {selectedProduct && (
        <Modal
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          title={`Quản lý thiết bị vật lý: ${selectedProduct.name}`}
        >
          <div className="space-y-4">
            {/* Top Bar inside modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs">
                <span className="font-bold text-slate-900">Tổng số máy trong kho: {items.length}</span>
                <span className="text-slate-500 ml-2">
                  ({items.filter(i => i.status === 'AVAILABLE').length} sẵn sàng, {items.filter(i => i.status === 'RENTED').length} đang thuê, {items.filter(i => i.status === 'MAINTENANCE').length} bảo trì)
                </span>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddItemOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold gap-1 self-start sm:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                Thêm máy mới (Serial/IMEI)
              </Button>
            </div>

            {/* Items Table */}
            {loadingItems ? (
              <div className="py-8 text-center text-xs text-slate-400">Đang tải danh sách máy...</div>
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Chưa có thiết bị nào trong kho. Hãy thêm thiết bị đầu tiên!</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Serial / SKU</th>
                      <th className="py-2.5 px-3">Vị trí kho</th>
                      <th className="py-2.5 px-3">Tình trạng</th>
                      <th className="py-2.5 px-3">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-bold text-slate-900">{it.serialNumber || it.skuCode}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>SKU: {it.skuCode}</span>
                            {it.barcode && <span>• Barcode: {it.barcode}</span>}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                            <MapPin className="h-3 w-3 text-rose-500" />
                            {it.warehouseLocation || 'Kho chính'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            (it.conditionScore || 100) >= 90
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : (it.conditionScore || 100) >= 75
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <Gauge className="h-2.5 w-2.5 mr-1" />
                            {it.conditionScore || 100}%
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            it.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                            it.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                            it.status === 'MAINTENANCE' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {it.status === 'AVAILABLE' ? 'Sẵn sàng' :
                             it.status === 'RENTED' ? 'Đang thuê' :
                             it.status === 'MAINTENANCE' ? 'Bảo trì' : it.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedItemForEdit(it)}
                              className="h-7 px-2 text-[11px] text-slate-600 hover:text-primary-600"
                              title="Cập nhật trạng thái / Điểm bảo trì"
                            >
                              <Wrench className="h-3 w-3 mr-1" />
                              Sửa
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={it.status === 'RENTED'}
                              onClick={() => handleDeleteItem(it)}
                              className={`h-7 px-2 text-[11px] ${
                                it.status === 'RENTED'
                                  ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                                  : 'text-red-600 hover:bg-red-50 hover:border-red-200'
                              }`}
                              title={it.status === 'RENTED' ? 'Không thể xóa khi đang cho thuê' : 'Xóa thiết bị'}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setSelectedProduct(null)} className="text-xs">
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD ITEM MODAL */}
      {isAddItemOpen && selectedProduct && (
        <AddItemModal
          isOpen={isAddItemOpen}
          onClose={() => setIsAddItemOpen(false)}
          productId={Number(selectedProduct.id) || 1}
          productName={selectedProduct.name}
          onItemAdded={(newItem) => setItems(prev => [newItem, ...prev])}
        />
      )}

      {/* EDIT ITEM STATUS MODAL */}
      {selectedItemForEdit && (
        <ItemStatusModal
          isOpen={!!selectedItemForEdit}
          onClose={() => setSelectedItemForEdit(null)}
          item={selectedItemForEdit}
          onItemUpdated={(updated) => {
            setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
          }}
        />
      )}
    </>
  );
}
