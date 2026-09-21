import { Eye } from 'lucide-react';
import { VirtualTable } from '@/shared/ui/VirtualTable';
import { Button } from '@/shared/ui/button';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import type { MerchantApplication } from '@/entities/user/useMerchantStore';

interface MerchantApprovalTableProps {
  applications: MerchantApplication[];
  onView: (app: MerchantApplication) => void;
}

export function MerchantApprovalTable({ applications, onView }: MerchantApprovalTableProps) {
  const columns = [
    {
      header: 'Công ty / Đại diện',
      accessorKey: 'companyName' as keyof MerchantApplication,
      width: '35%',
      cell: (item: MerchantApplication) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm">{item.companyName}</span>
          <span className="text-xs text-gray-500">{item.user.name} ({item.user.email})</span>
        </div>
      ),
    },
    {
      header: 'Mã số thuế',
      accessorKey: 'taxCode' as keyof MerchantApplication,
      width: '20%',
      cell: (item: MerchantApplication) => <span className="text-sm font-medium">{item.taxCode}</span>,
    },
    {
      header: 'Ngày đăng ký',
      accessorKey: 'createdAt' as keyof MerchantApplication,
      width: '20%',
      cell: (item: MerchantApplication) => (
        <span className="text-sm text-gray-600">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
      ),
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status' as keyof MerchantApplication,
      width: '15%',
      cell: (item: MerchantApplication) => <StatusBadge type="contract" status={item.status as any} />,
    },
    {
      header: 'Thao tác',
      accessorKey: 'id' as keyof MerchantApplication,
      width: '10%',
      cell: (item: MerchantApplication) => (
        <Button variant="outline" size="sm" className="h-8 px-2 text-primary-600 hover:bg-primary-50 hover:text-primary-700" onClick={() => onView(item)}>
          <Eye className="h-4 w-4 mr-1" /> Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <VirtualTable 
      data={applications} 
      columns={columns} 
      rowHeight={70}
      className="max-h-[70vh] min-h-[400px]"
    />
  );
}
