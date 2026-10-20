import { cn } from '@/shared/lib/utils';
import {
  type ContractStatus,
  type ItemStatus,
  CONTRACT_STATUS_INFO,
  ITEM_STATUS_INFO,
} from '@/entities/user/user.types';

type StatusType = 'contract' | 'item';

interface StatusBadgeProps {
  type: StatusType;
  status: ContractStatus | ItemStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ type, status, size = 'md', className }: StatusBadgeProps) {
  const info = type === 'contract'
    ? CONTRACT_STATUS_INFO[status as ContractStatus]
    : ITEM_STATUS_INFO[status as ItemStatus];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  if (!info) {
    const rawStatus = String(status || '').toUpperCase();
    const isPending = rawStatus.includes('PENDING') || rawStatus.includes('CHO');
    const isSuccess = rawStatus.includes('APPROVED') || rawStatus.includes('ACTIVE') || rawStatus.includes('COMPLETED') || rawStatus.includes('AVAILABLE');
    const isDanger = rawStatus.includes('REJECTED') || rawStatus.includes('CANCEL') || rawStatus.includes('DAMAGED') || rawStatus.includes('OVERDUE');

    const fallbackBg = isPending ? 'bg-amber-100' : isSuccess ? 'bg-emerald-100' : isDanger ? 'bg-rose-100' : 'bg-gray-100';
    const fallbackColor = isPending ? 'text-amber-800' : isSuccess ? 'text-emerald-800' : isDanger ? 'text-rose-800' : 'text-gray-700';

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200',
          fallbackBg,
          fallbackColor,
          sizeClasses[size],
          className
        )}
      >
        <span className={cn('inline-block rounded-full', size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2', fallbackColor.replace('text-', 'bg-'))} />
        {String(status || '')}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200',
        info.bgColor,
        info.color,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn(
        'inline-block rounded-full',
        size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
        info.color.replace('text-', 'bg-')
      )} />
      {info.label}
    </span>
  );
}
