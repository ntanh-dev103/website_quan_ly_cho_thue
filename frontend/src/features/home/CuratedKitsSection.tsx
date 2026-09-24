import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { mockProducts } from '@/entities/product/product.mock';

export interface CuratedKit {
  id: string;
  name: string;
  emoji: string;
  priceText: string;
  itemCount: number;
  image: string;
  tag: string;
  sampleProductId: string;
  description: string;
}

export const CURATED_KITS: CuratedKit[] = [
  {
    id: 'kit-camping',
    name: 'Kit Cắm trại Cuối tuần',
    emoji: '🏕️',
    priceText: 'Từ 500.000đ/ngày',
    itemCount: 5,
    tag: 'Dã ngoại',
    image: 'https://images.unsplash.com/photo-1504280390227-331bf8f8bfce?q=80&w=800',
    sampleProductId: 'prod-4',
    description: 'Lều Canvas Vintage, thảm trải, đèn bão, bếp dã ngoại & 2 ghế xếp phong cách Bắc Âu.',
  },
  {
    id: 'kit-launch-event',
    name: 'Kit Sự kiện Ra mắt & Gala',
    emoji: '👗',
    priceText: 'Từ 1.200.000đ/ngày',
    itemCount: 4,
    tag: 'Sự kiện thảm đỏ',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    sampleProductId: 'prod-3',
    description: 'Đầm dạ hội cao cấp, bộ trang sức sapphire, giày gót dạ tiệc & clutch cầm tay kim sa.',
  },
  {
    id: 'kit-cinematic',
    name: 'Kit Quay Phim MV / Vlog Pro',
    emoji: '🎥',
    priceText: 'Từ 1.650.000đ/ngày',
    itemCount: 6,
    tag: 'Sản xuất hình ảnh',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
    sampleProductId: 'prod-2',
    description: 'Sony A7 IV, Lens G-Master, Gimbal Ronin RS3, Micro không dây DJI Mic 2 & 2 pin sơ cua.',
  },
  {
    id: 'kit-date-night',
    name: 'Kit Date Night Sang Trọng',
    emoji: '✨',
    priceText: 'Từ 750.000đ/ngày',
    itemCount: 3,
    tag: 'Hẹn hò lãng mạn',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
    sampleProductId: 'prod-8',
    description: 'Vest tuxedo Ý cao cấp, nước hoa niche chiết & xe máy điện Vespa phong cách cổ điển.',
  },
  {
    id: 'kit-roadtrip',
    name: 'Kit Roadtrip Phượt Xuyên Việt',
    emoji: '🚗',
    priceText: 'Từ 1.450.000đ/ngày',
    itemCount: 4,
    tag: 'Du lịch vi vu',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
    sampleProductId: 'prod-1',
    description: 'VinFast VF8 SUV điện, giá nóc chở hành lý, tủ lạnh mini ô tô & bộ vá lốp khẩn cấp.',
  },
  {
    id: 'kit-studio-creator',
    name: 'Kit Creator Di Động 4K',
    emoji: '💻',
    priceText: 'Từ 1.800.000đ/ngày',
    itemCount: 5,
    tag: 'Workstation',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
    sampleProductId: 'prod-5',
    description: 'MacBook Pro 16 M3 Max, Flycam DJI Mavic 3 Cine, Hub chuyển đổi & màn hình phụ 4K di động.',
  },
];

export function CuratedKitsSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsOpen } = useGhostCartStore();

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddKitToCart = (kit: CuratedKit) => {
    // Find representative product in mock
    const product = mockProducts.find((p) => p.id === kit.sampleProductId) || mockProducts[0];
    addItem(product, 2);
    setIsOpen(true);
  };

  return (
    <section id="curated-kits-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 relative group/section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Lifestyle Bundling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Thuê theo Phong cách
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gói đồ trọn gói cho mọi dịp — tiết kiệm thời gian chuẩn bị và tối ưu chi phí
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Scroll arrow buttons for desktop */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 shadow-2xs transition-all active:scale-95"
              aria-label="Cuộn trái"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 shadow-2xs transition-all active:scale-95"
              aria-label="Cuộn phải"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/catalog')}
            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 sm:px-3 text-xs sm:text-sm font-bold group"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CURATED_KITS.map((kit) => (
          <div
            key={kit.id}
            className="min-w-[280px] sm:min-w-[300px] h-[340px] rounded-xl shadow-md relative overflow-hidden shrink-0 snap-start group/card cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            {/* Background Lifestyle Image */}
            <img
              src={kit.image}
              alt={kit.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              loading="lazy"
            />

            {/* Top Tag & Item Count Badge */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
              <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                {kit.tag}
              </span>
              <span className="bg-white/25 backdrop-blur-md text-white font-bold rounded-full px-2.5 py-1 text-xs border border-white/30">
                {kit.itemCount} sản phẩm
              </span>
            </div>

            {/* Gradient Overlay for bottom text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent" />

            {/* Bottom Content */}
            <div className="absolute bottom-0 inset-x-0 p-4 text-white z-10 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl">{kit.emoji}</span>
                <span className="font-bold text-lg leading-snug drop-shadow-sm text-white">
                  {kit.name}
                </span>
              </div>

              <p className="text-xs text-white/80 line-clamp-2 mb-3 leading-relaxed">
                {kit.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                <span className="text-xs sm:text-sm font-extrabold text-amber-300">
                  {kit.priceText}
                </span>

                {/* Hover overlay button: Xem chi tiết / Thuê ngay */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddKitToCart(kit);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-primary-700 text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thuê combo</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
