import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Percent 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface TierCardProps {
  code: string;
  name: string;
  rate: string;
  badge: string;
  benefit: string;
  description: string;
  isPopular?: boolean;
}

const TIERS: TierCardProps[] = [
  {
    code: 'C1',
    name: 'Khách Mới',
    rate: '40%',
    badge: 'Khởi đầu',
    benefit: 'Đặt cọc tiêu chuẩn',
    description: 'Áp dụng cho mọi tài khoản mới đăng ký sau khi xác thực CCCD/Bằng lái xe.',
  },
  {
    code: 'C2',
    name: 'Hạng Bạc',
    rate: '30%',
    badge: 'Giảm 10% cọc',
    benefit: 'Tích lũy 3 đơn tốt',
    description: 'Duyệt đơn nhanh hơn, giảm ngay 10% mức ký quỹ cọc thiết bị.',
  },
  {
    code: 'C3',
    name: 'Hạng Vàng',
    rate: '15%',
    badge: 'Giảm 25% cọc',
    benefit: 'Ưu tiên giao hỏa tốc',
    description: 'Thành viên thân thiết, chỉ cọc 15% giá trị máy, ưu tiên giữ máy mùa cao điểm.',
    isPopular: true,
  },
  {
    code: 'C4',
    name: 'Kim Cương',
    rate: '0%',
    badge: 'Miễn cọc 100%',
    benefit: 'Bàn giao không cần cọc',
    description: 'Đặc quyền cao nhất: Miễn hoàn toàn tiền đặt cọc tài sản, hỗ trợ hợp đồng VIP.',
  },
];

export function TierBenefitSection() {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Percent className="h-3.5 w-3.5" />
            <span>Chính sách Cọc Minh Bạch Độc Quyền</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
            Xếp hạng Tín nhiệm — Thuê đồ Miễn cọc
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Hệ thống chấm điểm uy tín tự động giúp người thuê không bị chôn vốn cọc cao như cách thuê truyền thống. Càng thuê nhiều đơn hoàn trả đúng hẹn, mức cọc càng giảm về 0%.
          </p>
        </div>

        <Link to="/register" className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-gray-200 text-gray-800 hover:bg-gray-50 font-semibold gap-1.5 text-xs sm:text-sm"
          >
            <span>Đăng ký nhận hạng C1</span>
            <ArrowRight className="h-4 w-4 text-primary-600" />
          </Button>
        </Link>
      </div>

      {/* 4 Bento Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.code}
            className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 relative flex flex-col justify-between ${
              tier.code === 'C4'
                ? 'bg-gradient-to-b from-primary-900 to-indigo-950 text-white shadow-lg ring-1 ring-primary-500/30'
                : tier.isPopular
                ? 'bg-white border-2 border-primary-500 shadow-md'
                : 'bg-white border border-gray-200/90 shadow-2xs hover:shadow-md'
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                  tier.code === 'C4'
                    ? 'bg-emerald-400 text-gray-950 font-black'
                    : tier.isPopular
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tier.code} · {tier.name}
              </span>

              {tier.code === 'C4' ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  VIP
                </span>
              ) : (
                <span className="text-[11px] text-gray-400 font-medium">
                  {tier.badge}
                </span>
              )}
            </div>

            {/* Deposit Rate Display */}
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums">
                  {tier.rate}
                </span>
                <span className={`text-xs font-semibold ${tier.code === 'C4' ? 'text-white/80' : 'text-gray-500'}`}>
                  tiền cọc
                </span>
              </div>
              <p className={`text-xs font-bold mt-1 ${tier.code === 'C4' ? 'text-emerald-300' : 'text-primary-600'}`}>
                {tier.benefit}
              </p>
            </div>

            {/* Description */}
            <p className={`text-xs leading-relaxed mt-3 pt-3 border-t ${
              tier.code === 'C4' ? 'border-white/15 text-white/80' : 'border-gray-100 text-gray-500'
            }`}>
              {tier.description}
            </p>

            {/* Bottom mini indicator */}
            <div className={`mt-4 flex items-center gap-1.5 text-[11px] font-semibold ${
              tier.code === 'C4' ? 'text-emerald-400' : 'text-gray-700'
            }`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>{tier.code === 'C4' ? 'Miễn hoàn toàn cọc' : 'Duyệt tự động theo hồ sơ'}</span>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
