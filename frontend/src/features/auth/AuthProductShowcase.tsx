/* Hallmark · component: AuthProductShowcase · genre: modern-minimal · theme: Indigo/Slate
 * philosophy: Honest rental marketplace ecosystem, tactile card framing, zero AI-slop blur gradients
 */
import { useState } from 'react';
import { 
  Car, 
  Camera, 
  Shirt, 
  ShieldCheck, 
  FileCheck, 
  Sparkles, 
  Clock,
  CheckCircle2
} from 'lucide-react';

interface EcosystemFeature {
  id: string;
  name: string;
  tag: string;
  icon: typeof Car;
  items: string[];
}

const CATEGORIES: EcosystemFeature[] = [
  {
    id: 'vehicles',
    name: 'Phương tiện di chuyển',
    tag: 'Tự lái & Xe điện',
    icon: Car,
    items: ['Ô tô du lịch 4-7 chỗ', 'Xe máy tay ga cao cấp', 'Xe máy điện VinFast'],
  },
  {
    id: 'tech',
    name: 'Thiết bị & Công nghệ',
    tag: 'Sản xuất & Văn phòng',
    icon: Camera,
    items: ['Máy ảnh & Ống kính Sony/Canon', 'Laptop đồ họa & Gaming', 'Máy chiếu & Đèn studio'],
  },
  {
    id: 'events',
    name: 'Sự kiện & Thời trang',
    tag: 'Tiệc cưới & Hội nghị',
    icon: Shirt,
    items: ['Vest & Váy dạ hội thiết kế', 'Âm thanh ánh sáng sân khấu', 'Đạo cụ quay phim chụp ảnh'],
  },
];

export function AuthProductShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>('vehicles');

  const selected = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 xl:p-12 select-none bg-slate-900 text-white overflow-hidden">
      {/* Subtle geometric grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* TOP: Brand Value Proposition */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>HỆ SINH THÁI CHO THUÊ TOÀN DIỆN RENTHUB</span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-white leading-tight">
          Giải pháp tối ưu tài sản, <br />
          <span className="text-indigo-400 font-extrabold">thuê linh hoạt theo nhu cầu</span>
        </h1>

        <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
          Nền tảng kết nối trực tiếp chủ sở hữu tài sản và người thuê với quy trình kiểm định minh bạch, hợp đồng điện tử bảo chứng và chính sách cọc giảm dần theo hạng thành viên.
        </p>
      </div>

      {/* CENTER: Clean Scene Card & Interactive Category Preview */}
      <div className="relative z-10 my-auto py-4 space-y-4">
        {/* Showcase Visual Card */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800/60 shadow-2xl">
          <div className="aspect-[16/9] w-full overflow-hidden relative">
            <img
              src="/images/rentalshop_v2_light_3d.jpg"
              alt="Hệ sinh thái cho thuê RentHub"
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
              onError={(e) => {
                // Graceful fallback if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            {/* Overlay Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Live active category caption on image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Kiểm định kỹ thuật 100% trước khi bàn giao
              </span>
              <span className="text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700 text-slate-300">
                Sẵn sàng giao nhận
              </span>
            </div>
          </div>
        </div>

        {/* Category Pill Switcher */}
        <div className="grid grid-cols-3 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-start p-3 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold truncate">{cat.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 truncate w-full">
                  {cat.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Asset Highlights */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-bold">Nổi bật:</span>
            <span className="truncate">{selected.items.join(' • ')}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM: Three Core Pillars (Honest copy) */}
      <div className="relative z-10 pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Giảm tới 25% cọc</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Áp dụng qua hệ thống điểm tín nhiệm thành viên.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hợp đồng số hóa</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Ký duyệt trực tuyến, xác nhận tình trạng bằng ảnh chụp.
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Thuê theo giờ / ngày</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Thời hạn thuê linh hoạt, hỗ trợ gia hạn nhanh chóng.
          </p>
        </div>
      </div>
    </div>
  );
}
