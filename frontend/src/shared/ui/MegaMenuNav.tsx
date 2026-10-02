import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Car, 
  Camera, 
  Shirt, 
  Sparkles, 
  Layers, 
  ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { categories } from '@/entities/product/product.mock';
import type { Category } from '@/entities/product/product.types';

interface CategoryMeta {
  icon: LucideIcon;
  subDescriptions: Record<string, string>;
  featureCard: {
    title: string;
    tag: string;
    image: string;
    price: string;
    link: string;
  };
}

const CATEGORY_META_MAP: Record<string, CategoryMeta> = {
  'cat-vehicles': {
    icon: Car,
    subDescriptions: {
      'cat-car': 'SUV điện thông minh, Sedan tự lái theo ngày',
      'cat-moto': 'Vespa cổ điển, xe tay ga & xe phượt xuyên Việt',
    },
    featureCard: {
      title: 'VinFast VF8 SUV Điện',
      tag: 'Thuê nhiều nhất',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800',
      price: '1.200.000đ/ngày',
      link: '/catalog?category=o-to',
    },
  },
  'cat-tech': {
    icon: Camera,
    subDescriptions: {
      'cat-camera': 'Sony Full-frame 4K, Lens G-Master, Flycam DJI',
      'cat-laptop': 'MacBook Pro M3 Max, Workstation đồ họa render',
    },
    featureCard: {
      title: 'Sony Alpha A7 IV + Lens',
      tag: 'Thiết bị tuyển chọn',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
      price: '850.000đ/ngày',
      link: '/catalog?category=may-anh',
    },
  },
  'cat-fashion': {
    icon: Shirt,
    subDescriptions: {
      'cat-dress': 'Đầm dạ hội Haute Couture đính pha lê thảm đỏ',
      'cat-suit': 'Vest Tuxedo Ý cao cấp, phong cách quý ông',
    },
    featureCard: {
      title: 'Dạ hội Sapphire Haute Couture',
      tag: 'Sự kiện sang trọng',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800',
      price: '950.000đ/ngày',
      link: '/catalog?category=vay-da-hoi',
    },
  },
};

export function MegaMenuNav() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string>(categories[0]?.id || 'cat-tech');
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeCategory: Category | undefined = categories.find((c) => c.id === activeCatId) || categories[0];
  const activeMeta = activeCategory ? CATEGORY_META_MAP[activeCategory.id] : undefined;

  // Open with zero delay
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  // Close with grace timer (160ms) to allow pointer traveling into panel
  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 160);
  };

  // Close on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="relative hidden lg:block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button (Hallmark N11 Trigger) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          isOpen
            ? 'bg-primary-50 text-primary-600 ring-2 ring-primary-100 shadow-2xs'
            : 'text-gray-700 hover:text-gray-950 hover:bg-gray-100'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Layers className="h-4 w-4 text-primary-600" />
        <span>Danh mục</span>
        <ChevronDown 
          className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-600' : 'text-gray-400'}`} 
        />
      </button>

      {/* Backdrop Scrim */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-16 bg-gray-950/20 backdrop-blur-xs z-30 transition-opacity animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 2-Level Mega Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full pt-2 z-40 w-[780px] animate-scale-in">
          <div className="bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-200/90 shadow-2xl shadow-gray-950/15 overflow-hidden">
            
            {/* Header of Mega Menu */}
            <div className="px-6 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Hệ thống phân cấp thiết bị đa tầng</span>
              </span>
              <Link
                to="/catalog"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
              >
                <span>Xem tất cả danh mục</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Content: 3 Columns (Cấp 1 -> Cấp 2 -> Feature Card) */}
            <div className="grid grid-cols-12 p-6 gap-6">
              
              {/* CỘT CẤP 1: Danh mục cha (5 cols) */}
              <div className="col-span-5 border-r border-gray-100 pr-5 space-y-1.5">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Ngành hàng chính (Cấp 1)
                </span>

                {categories.map((cat) => {
                  const meta = CATEGORY_META_MAP[cat.id];
                  const Icon = meta?.icon || Layers;
                  const isSelected = activeCatId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onMouseEnter={() => setActiveCatId(cat.id)}
                      onClick={() => {
                        navigate(`/catalog?category=${cat.slug}`);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-50/90 text-primary-900 font-bold border border-primary-200 shadow-2xs'
                          : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{cat.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">
                            {cat.children?.length || 0} nhóm con
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        isSelected ? 'text-primary-600 translate-x-0.5' : 'text-gray-300'
                      }`} />
                    </button>
                  );
                })}
              </div>

              {/* CỘT CẤP 2: Phân loại chi tiết (4 cols) */}
              <div className="col-span-4 space-y-2">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Phân loại (Cấp 2)
                </span>

                <div className="space-y-2">
                  {activeCategory?.children && activeCategory.children.length > 0 ? (
                    activeCategory.children.map((sub) => {
                      const desc = activeMeta?.subDescriptions[sub.id] || `Thiết bị ${sub.name.toLowerCase()} chính hãng`;
                      return (
                        <Link
                          key={sub.id}
                          to={`/catalog?category=${sub.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-gray-50/80 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {sub.name}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {desc}
                          </p>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-xs text-gray-400 py-6 text-center">
                      Chưa có danh mục con
                    </div>
                  )}
                </div>
              </div>

              {/* CỘT 3: Promoted Feature Card (3 cols) */}
              <div className="col-span-3">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Gợi ý tiêu biểu
                </span>

                {activeMeta?.featureCard ? (
                  <Link
                    to={activeMeta.featureCard.link}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl border border-gray-200/90 overflow-hidden bg-white hover:shadow-md transition-all group"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={activeMeta.featureCard.image}
                        alt={activeMeta.featureCard.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gray-950/70 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {activeMeta.featureCard.tag}
                      </span>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {activeMeta.featureCard.title}
                      </h4>
                      <p className="text-xs font-extrabold text-primary-600 mt-1 tabular-nums">
                        {activeMeta.featureCard.price}
                      </p>
                    </div>
                  </Link>
                ) : null}
              </div>

            </div>

            {/* Bottom Bar: Help footnote */}
            <div className="px-6 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>Được bảo chứng 100% hợp đồng điện tử qua RentHub</span>
              <span className="text-gray-400">Nhấn Esc để đóng</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
