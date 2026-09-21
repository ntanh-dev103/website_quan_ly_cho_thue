import { Lock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import type { Tier } from '@/entities/user/user.types';

interface UpgradePromptProps {
  requiredTier?: Tier;
  className?: string;
}

export function UpgradePrompt({ requiredTier, className }: UpgradePromptProps) {
  const tierLabel = requiredTier ? ` (${requiredTier})` : '';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-200/50',
        'bg-white/70 backdrop-blur-xl shadow-lg',
        'p-8 text-center',
        'animate-fade-in',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Lock icon with glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl scale-150" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 shadow-md">
            <Lock className="h-7 w-7 text-primary-600" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Nâng cấp để mở khóa
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Tính năng này yêu cầu hạng mục cao hơn{tierLabel}. Nâng cấp tài khoản để truy cập đầy đủ.
          </p>
        </div>

        {/* CTA */}
        <Button variant="default" size="lg" className="mt-2 group">
          Nâng cấp ngay
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>
    </div>
  );
}
