import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface HeroSectionProps {
  onStartRental?: () => void;
}

export function HeroSection({ onStartRental }: HeroSectionProps) {
  const handleScrollToKits = () => {
    if (onStartRental) {
      onStartRental();
    } else {
      const el = document.getElementById('curated-kits-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#7C3AED] py-12 md:py-20 text-white shadow-md">
      {/* Subtle abstract background mesh & geometric accents */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-violet-300 blur-3xl" />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} 
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Overline */}
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white opacity-90">
            Nền tảng Cho thuê Bảo đảm
          </span>
        </div>

        {/* Headline H1 */}
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 sm:mb-6 leading-tight drop-shadow-sm">
          Thuê đồ xịn — Trả ngay hôm nay
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl font-normal text-white opacity-90 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
          Hàng nghìn sản phẩm cao cấp từ đối tác uy tín. Giao hỏa tốc nội thành, bảo hiểm tài sản toàn diện.
        </p>

        {/* CTA Block */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <Button
            type="button"
            size="lg"
            onClick={handleScrollToKits}
            className="w-full sm:w-auto h-12 px-7 rounded-lg bg-white text-[#4F46E5] hover:bg-gray-50 font-bold shadow-lg shadow-indigo-950/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Bắt đầu thuê ngay</span>
            <ArrowRight className="h-4 w-4 text-[#4F46E5]" />
          </Button>

          <Link to="/partner" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-7 rounded-lg bg-transparent border-white/90 text-white hover:bg-white/10 hover:text-white font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Building2 className="h-4 w-4 text-white" />
              <span>Trở thành Đối tác</span>
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 sm:mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/80 font-medium">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>Xác thực CCCD & Bằng lái</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span>Miễn cọc đến 100% (Hạng C3/C4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
            <span>Hợp đồng điện tử tức thì</span>
          </div>
        </div>
      </div>
    </section>
  );
}
