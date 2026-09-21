import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { VirtualTable } from '@/shared/ui/VirtualTable';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import type { Product } from '@/entities/product/product.types';
import { categories } from '@/entities/product/product.mock';
import { toast } from 'sonner';

interface InventoryTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export function InventoryTable({ products, onEdit }: InventoryTableProps) {
  const [data, setData] = useState(products);

  const handleDelete = (product: Product) => {
    // Rule: DELETE Block if Item is RENTED
    // We mock this by checking if status is not AVAILABLE
    if (product.status !== 'AVAILABLE') {
      toast.error('Không thể xóa sản phẩm đang cho thuê hoặc đang bảo trì!');
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
      width: '40%',
      cell: (item: Product) => (
        <div className="flex items-center gap-3">
          <img src={item.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
          <div className="font-medium text-gray-900 line-clamp-2" title={item.name}>{item.name}</div>
        </div>
      ),
    },
    {
      header: 'Danh mục',
      accessorKey: 'categoryId' as keyof Product,
      width: '15%',
      cell: (item: Product) => {
        const catName = categories.flatMap(c => c.children || []).find(c => c.id === item.categoryId)?.name || 'Khác';
        return <span className="text-gray-600">{catName}</span>;
      },
    },
    {
      header: 'Giá / Ngày',
      accessorKey: 'pricePerDay' as keyof Product,
      width: '15%',
      cell: (item: Product) => <span className="font-semibold text-primary-600">{formatCurrency(item.pricePerDay)}</span>,
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status' as keyof Product,
      width: '15%',
      cell: (item: Product) => <StatusBadge type="item" status={item.status} />,
    },
    {
      header: 'Thao tác',
      accessorKey: 'id' as keyof Product,
      width: '15%',
      cell: (item: Product) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)} className="h-8 px-2 text-gray-600 hover:text-primary-600">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDelete(item)} className="h-8 px-2 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <VirtualTable 
      data={data} 
      columns={columns} 
      rowHeight={64}
      className="max-h-[70vh] min-h-[400px]"
    />
  );
}
