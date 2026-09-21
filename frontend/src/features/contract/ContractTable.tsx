import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { VirtualTable } from '@/shared/ui/VirtualTable';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import type { Contract } from '@/entities/contract/contract.types';
import { toast } from 'sonner';

interface ContractTableProps {
  contracts: Contract[];
  onReportDamage: (contract: Contract) => void;
}

export function ContractTable({ contracts, onReportDamage }: ContractTableProps) {
  
  const handleAction = (id: string, actionName: string) => {
    toast.success(`Thực hiện: ${actionName} cho đơn ${id}`);
  };

  const columns = [
    {
      header: 'Mã đơn / SP',
      accessorKey: 'contractCode' as keyof Contract,
      width: '25%',
      cell: (item: Contract) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-xs">{item.contractCode}</span>
          <span className="text-sm font-medium text-gray-700 line-clamp-1">{item.product.name}</span>
        </div>
      ),
    },
    {
      header: 'Khách hàng',
      accessorKey: 'customer' as keyof Contract,
      width: '20%',
      cell: (item: Contract) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{item.customer.name}</span>
          <span className="text-xs text-gray-500">{item.customer.email}</span>
        </div>
      ),
    },
    {
      header: 'Thời gian',
      accessorKey: 'startDate' as keyof Contract,
      width: '20%',
      cell: (item: Contract) => (
        <div className="flex flex-col text-xs text-gray-600">
          <span>Từ: {new Date(item.startDate).toLocaleDateString('vi-VN')}</span>
          <span>Đến: {new Date(item.endDate).toLocaleDateString('vi-VN')}</span>
        </div>
      ),
    },
    {
      header: 'Tổng tiền',
      accessorKey: 'totalAmount' as keyof Contract,
      width: '15%',
      cell: (item: Contract) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary-600">{formatCurrency(item.totalAmount)}</span>
          <span className="text-[10px] text-gray-500">(Cọc: {formatCurrency(item.depositAmount)})</span>
        </div>
      ),
    },
    {
      header: 'Thao tác',
      accessorKey: 'id' as keyof Contract,
      width: '20%',
      cell: (item: Contract) => {
        // Actions by Status
        if (item.status === 'PENDING') {
          return (
            <div className="flex flex-col gap-2">
              <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 px-2" onClick={() => handleAction(item.contractCode, 'Xác nhận chuẩn bị hàng')}>
                <CheckCircle className="h-3 w-3 mr-1" /> Xác nhận
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 px-2 border-red-200" onClick={() => handleAction(item.contractCode, 'Từ chối')}>
                <XCircle className="h-3 w-3 mr-1" /> Từ chối
              </Button>
            </div>
          );
        }
        
        if (item.status === 'RETURNED') {
          return (
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50 px-2" onClick={() => handleAction(item.contractCode, 'Xác nhận hàng nguyên vẹn')}>
                <CheckCircle className="h-3 w-3 mr-1" /> Hàng nguyên vẹn
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs text-amber-700 border-amber-300 hover:bg-amber-50 px-2" onClick={() => onReportDamage(item)}>
                <AlertTriangle className="h-3 w-3 mr-1" /> Báo cáo hư hỏng
              </Button>
            </div>
          );
        }

        return <span className="text-xs text-gray-400 italic">Không có thao tác</span>;
      },
    },
  ];

  return (
    <VirtualTable 
      data={contracts} 
      columns={columns} 
      rowHeight={80}
      className="max-h-[70vh] min-h-[400px]"
    />
  );
}
