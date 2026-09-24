import { useState } from 'react';
import { Car, Sparkles, Camera } from 'lucide-react';

interface EcosystemCategory {
  id: string;
  name: string;
  subtext: string;
  icon: any;
  accentColor: string;
  badgeBorder: string;
  badgeGlow: string;
}

const CATEGORIES: EcosystemCategory[] = [
  {
    id: 'vehicles',
    name: 'Phương tiện',
    subtext: 'Ô tô • Xe máy • Xe điện',
    icon: Car,
    accentColor: 'text-[#2563EB]',
    badgeBorder: 'border-[#2563EB]/25',
    badgeGlow: 'shadow-[0_8px_20px_rgba(37,99,235,0.12)]',
  },
  {
    id: 'fashion',
    name: 'Thời trang & Sự kiện',
    subtext: 'Trang phục • Đạo cụ • Sự kiện',
    icon: Sparkles,
    accentColor: 'text-[#8B5CF6]',
    badgeBorder: 'border-[#8B5CF6]/25',
    badgeGlow: 'shadow-[0_8px_20px_rgba(139,92,246,0.12)]',
  },
  {
    id: 'tech',
    name: 'Thiết bị công nghệ',
    subtext: 'Camera • Laptop • Máy chiếu',
    icon: Camera,
    accentColor: 'text-[#06B6D4]',
    badgeBorder: 'border-[#06B6D4]/25',
    badgeGlow: 'shadow-[0_8px_20px_rgba(6,182,212,0.14)]',
  },
];

export function AuthProductShowcase() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 xl:p-12 select-none bg-[#EEF8FF] text-[#0F172A] overflow-hidden">
      {/* Soft atmospheric blue & cyan ambient glows */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#E0F2FE]/80 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-100/60 rounded-full blur-[110px] pointer-events-none" />
      
      {/* TOP: Hero Typography Area */}
      <div className="relative z-10 space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#D7E5F0] text-[#06B6D4] text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
          <span>MỘT NỀN TẢNG — MỌI NHU CẦU THUÊ</span>
        </div>

        <h1 className="text-3xl xl:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
          Thuê mọi thứ <br />
          <span className="bg-gradient-to-r from-[#06B6D4] via-[#0284C7] to-[#2563EB] bg-clip-text text-transparent">
            bạn cần
          </span>
        </h1>

        <p className="text-xs xl:text-sm text-[#64748B] max-w-lg leading-relaxed font-normal">
          Một nền tảng cho thuê phương tiện, thời trang, sự kiện và thiết bị công nghệ.
        </p>

        <p className="text-xs font-semibold text-[#0F172A] tracking-wide flex items-center gap-2 pt-1">
          <span>Nhanh chóng</span>
          <span className="text-[#06B6D4] font-bold">•</span>
          <span>An toàn</span>
          <span className="text-[#06B6D4] font-bold">•</span>
          <span>Linh hoạt</span>
        </p>
      </div>

      {/* CENTER: Main 3D Rental Ecosystem (Direct Scene, NO nested UI frame) */}
      <div className="relative z-10 my-auto py-2 flex items-center justify-center">
        <div className="relative w-full max-w-2xl">
          {/* Main 3D Scene Image directly on background */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl transition-transform duration-700 hover:scale-[1.01]">
            <img
              src="/images/rentalshop_v2_light_3d.jpg"
              alt="RentalShop V2 — Light 3D Rental Ecosystem"
              className="w-full h-full object-cover object-left-top rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            />
          </div>

          {/* Floating Category Glass Badges overlayed directly */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-left transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-md border ${
                    isActive ? `${cat.badgeBorder} ${cat.badgeGlow} scale-[1.02] bg-white` : 'border-[#D7E5F0] hover:border-[#06B6D4]/40 shadow-sm'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-[#D7E5F0]/80 ${cat.accentColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#0F172A] block truncate">{cat.name}</span>
                    <span className="text-[10px] text-[#64748B] block truncate">{cat.subtext}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTNOTE */}
      <div className="relative z-10 pt-2 text-[11px] text-[#64748B]">
        <span>Hệ sinh thái cho thuê kết nối hơn 10,000+ thiết bị & phương tiện đã kiểm định.</span>
      </div>
    </div>
  );
}
