import { useState } from 'react';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { toast } from 'sonner';

interface CommissionRateCardProps {
  currentTier?: string;
  commissionRate?: number;
  onUpgrade?: () => void;
}

const TIERS_CONFIG = [
  { tier: 'M1', name: 'Starter', rate: 0.15, limit: '20 sản phẩm', autoApprove: false, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' },
  { tier: 'M2', name: 'Pro Merchant', rate: 0.10, limit: 'Không giới hạn', autoApprove: true, badgeColor: 'bg-blue-100 text-blue-800 border-blue-300' },
  { tier: 'M3', name: 'Enterprise', rate: 0.05, limit: 'Không giới hạn', autoApprove: true, badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
  { tier: 'M4', name: 'Flagship Partner', rate: 0.02, limit: 'Không giới hạn & B2B Net-30', autoApprove: true, badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
];

export function CommissionRateCard({ currentTier = 'M1', commissionRate = 0.15, onUpgrade }: CommissionRateCardProps) {
  const { updateTier } = useAuthStore();
  const [revenueSim, setRevenueSim] = useState<number>(30000000); // 30tr simulation default

  const activeTier = currentTier.toUpperCase();
  const currentConfig = TIERS_CONFIG.find(t => t.tier === activeTier) || TIERS_CONFIG[0];
  const nextTierConfig = TIERS_CONFIG.find(t => t.tier === 'M2');

  const currentFee = Math.round(revenueSim * currentConfig.rate);
  const nextFee = nextTierConfig ? Math.round(revenueSim * nextTierConfig.rate) : currentFee;
  const savings = Math.max(0, currentFee - nextFee);

  const handleQuickUpgrade = () => {
    updateTier('M2');
    toast.success('Chúc mừng! Đã nâng hạng thành công lên M2 Pro!', {
      description: 'Phí hoa hồng sàn của bạn đã được giảm từ 15% xuống 10%. Đã mở khóa tính năng Tự động duyệt đơn (Auto-Approve).',
    });
    if (onUpgrade) onUpgrade();
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hạng tài khoản Đối tác</span>
            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
              {currentConfig.tier} - {currentConfig.name}
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            Mức hoa hồng sàn hiện tại: <span className="text-primary-600">{(commissionRate * 100).toFixed(0)}%</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Áp dụng cho mọi hợp đồng hoàn tất nghiệm thu trả hàng thành công
          </p>
        </div>

        {activeTier === 'M1' && (
          <Button
            onClick={handleQuickUpgrade}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            Nâng cấp lên M2 Pro (10%)
          </Button>
        )}
      </div>

      {/* Tiers Comparison Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS_CONFIG.map((t) => {
          const isSelected = t.tier === activeTier;
          return (
            <div
              key={t.tier}
              className={`p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/50 shadow-xs ring-1 ring-primary-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-sm text-slate-900">{t.tier}</span>
                <span className="font-bold text-xs text-primary-700">{(t.rate * 100)}%</span>
              </div>
              <p className="text-xs font-medium text-slate-600 mb-2">{t.name}</p>
              <div className="space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                <p>• {t.limit}</p>
                <p>• {t.autoApprove ? 'Có Auto-Approve' : 'Duyệt tay'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Savings Simulator */}
      <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Mô phỏng doanh thu & Tiết kiệm hoa hồng khi nâng hạng:</span>
          </div>
          <span className="text-xs text-amber-300 font-mono font-bold">
            Doanh thu tháng: {formatCurrency(revenueSim)}
          </span>
        </div>

        <input
          type="range"
          min={10000000}
          max={200000000}
          step={5000000}
          value={revenueSim}
          onChange={(e) => setRevenueSim(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800">
          <div>
            <span className="text-slate-400 block text-[11px]">Phí sàn gói M1 (15%):</span>
            <span className="text-rose-400 font-bold">{formatCurrency(Math.round(revenueSim * 0.15))}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Phí sàn gói M2 (10%):</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(Math.round(revenueSim * 0.10))}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tiết kiệm ròng mỗi tháng:</span>
            <span className="text-amber-300 font-extrabold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              +{formatCurrency(savings)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
