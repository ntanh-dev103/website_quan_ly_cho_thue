import { ShieldCheck, Sparkles, Clock, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BenefitSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 -mt-8 sm:-mt-12 relative z-20">
      {/* Bento Grid Layout - Breaks the standard AI 3-column template */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* BENTO CARD 1: Tier Tín Nhiệm (Large / Span 2 columns on Desktop) */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-[#06B6D4]" />
                <span>Độc Quyền Tại RentalShop</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">Bảo chứng uy tín người dùng</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Hệ thống Tier Tín Nhiệm — Miễn đặt cọc lên tới 100%
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-6">
              Thuê càng nhiều, uy tín càng tăng. Điểm tín nhiệm minh bạch giúp bạn thuê ngay các thiết bị đắt tiền như Sony FX3, MacBook M3 hay ô tô mà không phải chôn vốn tiền đặt cọc.
            </p>

            {/* 4 Tier Progress Steps Pill Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {[
                { tier: 'C1 Đồng', deposit: 'Cọc 40%', perk: 'Thành viên mới', color: 'border-slate-200 bg-slate-50 text-slate-700' },
                { tier: 'C2 Bạc', deposit: 'Cọc 25%', perk: 'Thuê từ 3 đơn', color: 'border-blue-200 bg-blue-50 text-blue-800' },
                { tier: 'C3 Vàng', deposit: 'Cọc 10%', perk: 'Giảm 10% phí thuê', color: 'border-amber-200 bg-amber-50 text-amber-800' },
                { tier: 'C4 Kim Cương', deposit: 'Miễn cọc 0đ', perk: 'Thanh toán Net-30', color: 'border-cyan-300 bg-cyan-50 text-cyan-900 font-bold' },
              ].map((t) => (
                <div key={t.tier} className={`p-3 rounded-2xl border ${t.color} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{t.tier}</span>
                    <Award className="h-3.5 w-3.5 shrink-0 opacity-80" />
                  </div>
                  <div className="mt-2">
                    <span className="text-sm font-extrabold block">{t.deposit}</span>
                    <span className="text-[10px] opacity-75 block truncate">{t.perk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Bắt đầu ngay hôm nay để nhận hạng C1 tự động</span>
            <Link to="/register" className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:text-blue-700 transition-colors">
              <span>Tìm hiểu chính sách Tier</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* BENTO CARD 2: Bảo Vệ Pháp Lý & Giao Dịch An Toàn */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/80 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
              Hợp đồng điện tử & Bảo chứng tài sản 100%
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Ký số tức thì trong 60 giây. Mọi thiết bị bàn giao đều có biên bản kiểm tra ngoại quan sê-ri minh bạch, bảo vệ tài sản cả người thuê và chủ đồ.
            </p>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Bảo mật dữ liệu theo chuẩn nhà nước</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Khấu trừ hư hại công khai, rõ ràng</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-[#06B6D4]" />
              <span>Giao nhận hỏa tốc 2 giờ nội thành</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
