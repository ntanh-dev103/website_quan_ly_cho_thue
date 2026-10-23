import { Eye } from 'lucide-react';
import { VirtualTable } from '@/shared/ui/VirtualTable';
import { Button } from '@/shared/ui/button';
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
      width: '32%',
      cell: (item: MerchantApplication) => (
        <div className="flex flex-col min-w-0 pr-2">
          <span className="font-bold text-slate-900 text-sm truncate">{item.companyName}</span>
          <span className="text-xs text-slate-500 truncate mt-0.5">
            {item.user?.name || 'Chưa rõ'} ({item.user?.email || 'N/A'})
          </span>
        </div>
      ),
    },
    {
      header: 'Mã số thuế',
      accessorKey: 'taxCode' as keyof MerchantApplication,
      width: '18%',
      cell: (item: MerchantApplication) => (
        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
          {item.taxCode || 'Chưa cập nhật'}
        </span>
      ),
    },
    {
      header: 'Ngày đăng ký',
      accessorKey: 'createdAt' as keyof MerchantApplication,
      width: '18%',
      cell: (item: MerchantApplication) => {
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Mới đây';
        return <span className="text-xs text-slate-600 font-medium">{dateStr}</span>;
      },
    },
    {
      header: 'Trạng thái',
      accessorKey: 'status' as keyof MerchantApplication,
      width: '18%',
      cell: (item: MerchantApplication) => {
        if (item.status === 'PENDING') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Chờ duyệt
            </span>
          );
        }
        if (item.status === 'APPROVED') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Đã duyệt
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Từ chối
          </span>
        );
      },
    },
    {
      header: 'Thao tác',
      accessorKey: 'id' as keyof MerchantApplication,
      width: '14%',
      cell: (item: MerchantApplication) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 text-xs font-bold text-primary-600 hover:bg-primary-50 hover:text-primary-700 border-primary-200 shadow-2xs cursor-pointer" 
          onClick={() => onView(item)}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" /> Xem xét
        </Button>
      ),
    },
  ];

  return (
    <VirtualTable 
      data={applications} 
      columns={columns} 
      rowHeight={70}
      className="max-h-[70vh] min-h-[400px] border-0 rounded-none"
    />
  );
}
