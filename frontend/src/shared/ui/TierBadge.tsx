import { cn } from '@/shared/lib/utils';
import {
  type Role,
  type Tier,
  type CustomerTier,
  type MerchantTier,
  CUSTOMER_TIER_INFO,
  MERCHANT_TIER_INFO,
} from '@/entities/user/user.types';

interface TierBadgeProps {
  role: Role;
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function TierBadge({ role, tier, size = 'md', className, showLabel = true }: TierBadgeProps) {
  const info = role === 'CUSTOMER'
    ? CUSTOMER_TIER_INFO[tier as CustomerTier]
    : role === 'MERCHANT'
      ? MERCHANT_TIER_INFO[tier as MerchantTier]
      : null;

  if (!info) {
    if (role === 'ADMIN') {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full font-semibold border',
            'bg-red-50 text-red-700 border-red-300',
            size === 'sm' && 'text-xs px-2 py-0.5',
            size === 'md' && 'text-xs px-2.5 py-1',
            size === 'lg' && 'text-sm px-3 py-1.5',
            className
          )}
        >
          🛡️ {showLabel && 'Quản trị viên'}
        </span>
      );
    }
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  };

  // Special styling for premium tiers (C3/M3 = gold glow, C4/M4 = diamond glow)
  const isPremium = ['C3', 'M3', 'C4', 'M4'].includes(tier);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border transition-all duration-300',
        info.bgColor,
        info.color,
        info.borderColor,
        sizeClasses[size],
        isPremium && 'shadow-sm',
        (tier === 'C4' || tier === 'M4') && 'shadow-violet-200',
        (tier === 'C3' || tier === 'M3') && 'shadow-amber-200',
        className
      )}
    >
      <span className="leading-none">{info.icon}</span>
      {showLabel && (
        <span>{role === 'CUSTOMER' ? 'Khách' : 'Đối tác'} {info.label}</span>
      )}
    </span>
  );
}
