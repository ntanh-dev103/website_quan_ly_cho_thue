import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Layers, 
  Calendar, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Car,
  Camera,
  Shirt,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { categories } from '@/entities/product/product.mock';
import type { Category } from '@/entities/product/product.types';

const POPULAR_SEARCHES = [
  { label: 'Sony A7 IV', query: 'Sony' },
  { label: 'VinFast VF8', query: 'VinFast' },
  { label: 'MacBook M3 Max', query: 'MacBook' },
  { label: 'Lều Glamping', query: 'Lều' },
  { label: 'Flycam 4K', query: 'Flycam' },
  { label: 'Váy dạ hội', query: 'Váy' },
];

interface CategoryMeta {
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  subDescriptions: Record<string, string>;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'cat-vehicles': {
    icon: Car,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    subDescriptions: {
      'cat-car': 'SUV điện thông minh, Sedan tự lái theo ngày',
      'cat-moto': 'Vespa cổ điển & Xe phượt xuyên Việt',
    },
  },
  'cat-tech': {
    icon: Camera,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50',
    subDescriptions: {
      'cat-camera': 'Sony Full-frame 4K, Lens G-Master, Flycam DJI',
      'cat-laptop': 'MacBook Pro M3 Max, Workstation đồ họa',
    },
  },
  'cat-fashion': {
    icon: Shirt,
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
    subDescriptions: {
      'cat-dress': 'Đầm dạ hội Haute Couture, thảm đỏ sự kiện',
      'cat-suit': 'Vest Tuxedo Ý cao cấp, quý ông lịch lãm',
    },
  },
};

const LOCATION_DATA = [
  {
    city: 'Hồ Chí Minh',
    cityName: 'TP. Hồ Chí Minh',
    districts: ['Quận 1', 'Quận 3', 'Thủ Đức', 'Bình Thạnh'],
  },
  {
    city: 'Hà Nội',
    cityName: 'Hà Nội',
    districts: ['Đống Đa', 'Cầu Giấy', 'Hoàn Kiếm', 'Tây Hồ'],
  },
  {
    city: 'Đà Nẵng',
    cityName: 'Đà Nẵng',
    districts: ['Hải Châu', 'Sơn Trà'],
  },
];

export function QuickSearchFilterBar() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [startDate, setStartDate] = useState('');

  // Dropdown states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [activeParentCatId, setActiveParentCatId] = useState<string>(categories[0]?.id || 'cat-vehicles');
  const [mobileExpandedCatId, setMobileExpandedCatId] = useState<string | null>(categories[0]?.id || null);

  const categoryRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(e.target as Node)) {
        setIsDistrictOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryOpen(false);
        setIsDistrictOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute selected category details for display
  const selectedCategoryInfo = useMemo(() => {
    if (!category) return null;
    for (const cat of categories) {
      if (cat.slug === category) {
        return {
          parent: cat,
          sub: null,
          title: cat.name,
          subtitle: 'Tất cả thiết bị trong nhóm',
          icon: CATEGORY_META[cat.id]?.icon || Layers,
          colorClass: CATEGORY_META[cat.id]?.colorClass || 'text-emerald-600',
          bgClass: CATEGORY_META[cat.id]?.bgClass || 'bg-emerald-50',
        };
      }
      if (cat.children) {
        const sub = cat.children.find((c) => c.slug === category);
        if (sub) {
          return {
            parent: cat,
            sub,
            title: sub.name,
            subtitle: cat.name,
            icon: CATEGORY_META[cat.id]?.icon || Layers,
            colorClass: CATEGORY_META[cat.id]?.colorClass || 'text-emerald-600',
            bgClass: CATEGORY_META[cat.id]?.bgClass || 'bg-emerald-50',
          };
        }
      }
    }
    return null;
  }, [category]);

  const activeParentCategory: Category | undefined = categories.find((c) => c.id === activeParentCatId) || categories[0];
  const activeParentMeta = activeParentCategory ? CATEGORY_META[activeParentCategory.id] : undefined;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (category) params.append('category', category);
    if (district) params.append('district', district);
    if (startDate) params.append('startDate', startDate);

    navigate(`/catalog${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleQuickTagClick = (tagQuery: string) => {
    navigate(`/catalog?q=${encodeURIComponent(tagQuery)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
      
      {/* Main Search Console */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xl shadow-gray-900/5 p-3 sm:p-4 transition-all relative">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
            
            {/* Segment 1: Từ khóa tìm kiếm (3.5 cols) */}
            <div className="md:col-span-4 lg:col-span-3 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50/80 transition-colors flex items-center gap-2.5 border border-transparent focus-within:border-primary-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                <Search className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label 
                  htmlFor="quick-search-input" 
                  className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1"
                >
                  Thiết bị
                </label>
                <input
                  id="quick-search-input"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Sony, VF8, Lều..."
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Divider Desktop */}
            <div className="hidden lg:block w-px h-8 bg-gray-200 self-center" />

            {/* Segment 2: DANH MỤC (Menu Cấp 2 Popover) */}
            <div 
              ref={categoryRef}
              className="md:col-span-4 lg:col-span-3 relative"
            >
              <div
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsDistrictOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsCategoryOpen(!isCategoryOpen);
                  }
                }}
                className={`w-full p-2.5 sm:p-3 rounded-xl transition-all flex items-center gap-2.5 border cursor-pointer select-none ${
                  isCategoryOpen 
                    ? 'border-primary-300 bg-white ring-2 ring-primary-100 shadow-2xs' 
                    : 'border-transparent hover:bg-gray-50/80'
                }`}
              >
                {/* Dynamic Category Icon Badge */}
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 transition-colors ${
                  selectedCategoryInfo 
                    ? `${selectedCategoryInfo.bgClass} ${selectedCategoryInfo.colorClass}` 
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {selectedCategoryInfo ? (
                    <selectedCategoryInfo.icon className="h-4 w-4" />
                  ) : (
                    <Layers className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1">
                    Danh mục
                  </span>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {selectedCategoryInfo ? selectedCategoryInfo.title : 'Tất cả danh mục'}
                    </span>
                    {selectedCategoryInfo?.sub && (
                      <span className="hidden xl:inline text-[10px] font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                        {selectedCategoryInfo.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reset or Chevron Action */}
                <div className="flex items-center gap-1 shrink-0">
                  {category && (
                    <button
                      type="button"
                      aria-label="Xóa chọn danh mục"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategory('');
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isCategoryOpen ? 'rotate-180 text-primary-600' : ''
                  }`} />
                </div>
              </div>

              {/* ===== MENU CẤP 2 POPOVER PANEL ===== */}
              {isCategoryOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-[340px] sm:w-[500px] md:w-[520px] max-w-[calc(100vw-32px)] bg-white rounded-2xl border border-gray-200/90 shadow-2xl shadow-gray-900/15 p-3.5 sm:p-4 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  
                  {/* Popover Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Chọn danh mục thuê
                      </span>
                      <p className="text-xs text-gray-500 font-medium">Phân cấp 2 tầng đa dạng thiết bị</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory('');
                        setIsCategoryOpen(false);
                      }}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                        !category 
                          ? 'bg-primary-600 text-white shadow-2xs' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Tất cả</span>
                    </button>
                  </div>

                  {/* Desktop 2-Level Column Selector */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-3 pt-3">
                    
                    {/* Cột 1 (Cấp 1): Danh mục cha (5 cols) */}
                    <div className="sm:col-span-5 space-y-1.5 border-r border-gray-100 pr-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-0.5">
                        Cấp 1 • Nhóm ngành
                      </div>
                      {categories.map((cat) => {
                        const meta = CATEGORY_META[cat.id];
                        const CatIcon = meta?.icon || Layers;
                        const isHoveredOrActive = activeParentCatId === cat.id;
                        const isCurrentlySelected = category === cat.slug;

                        return (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setActiveParentCatId(cat.id)}
                            onClick={() => setActiveParentCatId(cat.id)}
                            role="button"
                            tabIndex={0}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                              isHoveredOrActive 
                                ? 'bg-primary-50 text-primary-900 font-semibold ring-1 ring-primary-200' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                                meta?.bgClass || 'bg-gray-100'
                              } ${meta?.colorClass || 'text-gray-600'}`}>
                                <CatIcon className="h-3.5 w-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold truncate leading-tight">
                                  {cat.name}
                                </div>
                                <div className="text-[10px] text-gray-400 font-normal">
                                  {cat.children?.length || 0} phân loại
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {isCurrentlySelected && (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                              )}
                              <ChevronRight className={`h-3.5 w-3.5 transition-transform ${
                                isHoveredOrActive ? 'translate-x-0.5 text-primary-600' : 'text-gray-300'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cột 2 (Cấp 2): Danh mục con (7 cols) */}
                    <div className="sm:col-span-7 flex flex-col justify-between">
                      <div>
                        {activeParentCategory && (
                          <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              Cấp 2 • {activeParentCategory.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setCategory(activeParentCategory.slug);
                                setIsCategoryOpen(false);
                              }}
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                                category === activeParentCategory.slug
                                  ? 'bg-primary-600 text-white'
                                  : 'text-primary-600 hover:bg-primary-50'
                              }`}
                            >
                              Chọn cả nhóm
                            </button>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          {activeParentCategory?.children?.map((sub) => {
                            const isSelected = category === sub.slug;
                            const desc = activeParentMeta?.subDescriptions[sub.id] || 'Thiết bị tuyển chọn';

                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  setCategory(sub.slug);
                                  setIsCategoryOpen(false);
                                }}
                                className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-center justify-between group cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary-50/80 border-primary-200 text-primary-950 shadow-2xs'
                                    : 'bg-gray-50/60 hover:bg-white hover:border-gray-300 border-gray-100 text-gray-800'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold leading-tight group-hover:text-primary-600 transition-colors">
                                      {sub.name}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                    {desc}
                                  </p>
                                </div>
                                <div className="shrink-0 flex items-center">
                                  {isSelected ? (
                                    <div className="h-5 w-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                                      <Check className="h-3 w-3 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Tip */}
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                        <span>Đã chọn: <strong className="text-gray-700">{selectedCategoryInfo ? selectedCategoryInfo.title : 'Tất cả'}</strong></span>
                        <span className="text-primary-600 font-medium">Bấm chọn để áp dụng</span>
                      </div>

                    </div>

                  </div>

                  {/* Mobile Accordion Mode (sm:hidden) */}
                  <div className="sm:hidden pt-3 space-y-2 max-h-[300px] overflow-y-auto">
                    {categories.map((cat) => {
                      const meta = CATEGORY_META[cat.id];
                      const CatIcon = meta?.icon || Layers;
                      const isExpanded = mobileExpandedCatId === cat.id;

                      return (
                        <div key={cat.id} className="border border-gray-100 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setMobileExpandedCatId(isExpanded ? null : cat.id)}
                            className="w-full p-2.5 bg-gray-50/70 hover:bg-gray-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <CatIcon className={`h-4 w-4 ${meta?.colorClass || 'text-gray-500'}`} />
                              <span className="text-xs font-bold text-gray-900">{cat.name}</span>
                            </div>
                            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`} />
                          </button>

                          {isExpanded && (
                            <div className="p-2 bg-white space-y-1 border-t border-gray-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setCategory(cat.slug);
                                  setIsCategoryOpen(false);
                                }}
                                className={`w-full px-3 py-1.5 text-left text-xs font-semibold rounded-lg flex items-center justify-between ${
                                  category === cat.slug 
                                    ? 'bg-primary-50 text-primary-700 font-bold' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span>Tất cả {cat.name}</span>
                                {category === cat.slug && <Check className="h-3.5 w-3.5 text-primary-600" />}
                              </button>
                              {cat.children?.map((sub) => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    setCategory(sub.slug);
                                    setIsCategoryOpen(false);
                                  }}
                                  className={`w-full px-3 py-1.5 text-left text-xs rounded-lg flex items-center justify-between ${
                                    category === sub.slug 
                                      ? 'bg-primary-600 text-white font-semibold' 
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <span>↳ {sub.name}</span>
                                  {category === sub.slug && <Check className="h-3.5 w-3.5" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>

            {/* Divider Desktop */}
            <div className="hidden lg:block w-px h-8 bg-gray-200 self-center" />

            {/* Segment 3: KHU VỰC (Location Popover) */}
            <div 
              ref={districtRef}
              className="md:col-span-4 lg:col-span-2 relative"
            >
              <div
                onClick={() => {
                  setIsDistrictOpen(!isDistrictOpen);
                  setIsCategoryOpen(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsDistrictOpen(!isDistrictOpen);
                  }
                }}
                className={`w-full p-2.5 sm:p-3 rounded-xl transition-all flex items-center gap-2.5 border cursor-pointer select-none ${
                  isDistrictOpen 
                    ? 'border-primary-300 bg-white ring-2 ring-primary-100 shadow-2xs' 
                    : 'border-transparent hover:bg-gray-50/80'
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1">
                    Khu vực
                  </span>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {district || 'Toàn quốc'}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {district && (
                    <button
                      type="button"
                      aria-label="Xóa chọn khu vực"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDistrict('');
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isDistrictOpen ? 'rotate-180 text-primary-600' : ''
                  }`} />
                </div>
              </div>

              {/* Location Popover Panel */}
              {isDistrictOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 w-[290px] sm:w-[320px] bg-white rounded-2xl border border-gray-200/90 shadow-2xl shadow-gray-900/15 p-3.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Chọn địa điểm nhận
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDistrict('');
                        setIsDistrictOpen(false);
                      }}
                      className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                        !district ? 'bg-primary-600 text-white' : 'text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      Toàn quốc
                    </button>
                  </div>

                  <div className="pt-2.5 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {LOCATION_DATA.map((loc) => (
                      <div key={loc.city} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">
                            {loc.cityName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDistrict(loc.city);
                              setIsDistrictOpen(false);
                            }}
                            className="text-[10px] text-primary-600 hover:underline font-semibold"
                          >
                            Toàn thành phố
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {loc.districts.map((d) => {
                            const isSelected = district === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  setDistrict(d);
                                  setIsDistrictOpen(false);
                                }}
                                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                                  isSelected 
                                    ? 'bg-primary-600 text-white shadow-2xs font-semibold' 
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/60'
                                }`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

            {/* Divider Desktop */}
            <div className="hidden lg:block w-px h-8 bg-gray-200 self-center" />

            {/* Segment 4: Ngày bắt đầu (2 cols) */}
            <div className="md:col-span-6 lg:col-span-2 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50/80 transition-colors flex items-center gap-2.5 border border-transparent focus-within:border-primary-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label 
                  htmlFor="quick-search-date" 
                  className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-1"
                >
                  Từ ngày
                </label>
                <input
                  id="quick-search-date"
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-900 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Segment 5: CTA Button (1.5 - 2 cols) */}
            <div className="md:col-span-6 lg:col-span-2 flex items-center justify-end">
              <Button
                type="submit"
                className="w-full h-11 sm:h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Tìm đồ thuê</span>
              </Button>
            </div>

          </div>
        </form>
      </div>

      {/* Quick Trend Chips */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 px-2">
        <span className="font-semibold text-gray-400 text-[11px] flex items-center gap-1 shrink-0">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>Tìm nhanh:</span>
        </span>
        {POPULAR_SEARCHES.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleQuickTagClick(item.query)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium text-[11px] transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>

    </div>
  );
}
