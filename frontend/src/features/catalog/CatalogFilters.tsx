import { Search, Truck, Layers, Car, Camera, Shirt, ChevronDown, Star, Award, RotateCcw } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { categories } from '@/entities/product/product.mock';
import { useCatalogFilterStore } from './useCatalogFilterStore';
import { useMemo, useState } from 'react';

const DISTRICTS = ['Quận 1', 'Quận 3', 'Đống Đa', 'Thủ Đức'];

const MERCHANT_TIERS = [
  { tier: 'M4', name: 'Kim Cương', badge: '💎 M4 (Ưu đãi 2%)' },
  { tier: 'M3', name: 'Vàng', badge: '👑 M3 (Uy tín 5%)' },
  { tier: 'M2', name: 'Bạc', badge: '🥈 M2 (10%)' },
  { tier: 'M1', name: 'Chuẩn', badge: '🔹 M1 (15%)' },
];

const CAT_ICON_MAP: Record<string, any> = {
  'cat-vehicles': Car,
  'cat-fashion': Shirt,
  'cat-tech': Camera,
};

export function CatalogFilters() {
  const {
    query, setQuery,
    categorySlug, setCategorySlug,
    districtFilter, setDistrictFilter,
    merchantTier, setMerchantTier,
    rating, setRating,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    eavFilters, toggleEavFilter,
    resetFilters,
  } = useCatalogFilterStore();


  const [expandedCatIds, setExpandedCatIds] = useState<string[]>(categories.map(c => c.id));

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCatIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const activeCategory = useMemo(() => {
    for (const cat of categories) {
      if (cat.slug === categorySlug) return cat;
      if (cat.children) {
        const sub = cat.children.find((c) => c.slug === categorySlug);
        if (sub) return sub;
      }
    }
    return null;
  }, [categorySlug]);

  const availableAttributes = activeCategory?.availableAttributes || [];

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Tìm kiếm
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tên sản phẩm..."
            className="pl-9"
            defaultValue={query}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setQuery(e.currentTarget.value);
              }
            }}
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Giá thuê / ngày
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              min={0}
              placeholder="Từ"
              defaultValue={minPrice ?? ''}
              onBlur={(e) => {
                const v = Number(e.currentTarget.value);
                setMinPrice(v > 0 ? v : null);
              }}
              className="text-sm"
            />
          </div>
          <span className="text-gray-400 text-sm shrink-0">—</span>
          <div className="flex-1">
            <Input
              type="number"
              min={0}
              placeholder="Đến"
              defaultValue={maxPrice ?? ''}
              onBlur={(e) => {
                const v = Number(e.currentTarget.value);
                setMaxPrice(v > 0 ? v : null);
              }}
              className="text-sm"
            />
          </div>
        </div>
        {(minPrice || maxPrice) && (
          <button
            type="button"
            onClick={() => { setMinPrice(null); setMaxPrice(null); }}
            className="text-[11px] font-semibold text-primary-600 hover:underline cursor-pointer"
          >
            Xóa khoảng giá
          </button>
        )}
      </div>

      {/* Categories (2-Level Tree Navigation) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Danh mục (Cấp 1 & Cấp 2)
          </Label>
          {categorySlug && (
            <button
              type="button"
              onClick={() => setCategorySlug('')}
              className="text-[11px] font-semibold text-primary-600 hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {/* Tất cả danh mục */}
          <button
            type="button"
            onClick={() => setCategorySlug('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              !categorySlug
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" />
              <span>Tất cả thiết bị</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${!categorySlug ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              Đa ngành
            </span>
          </button>

          {/* Level 1 & Level 2 Categories */}
          {categories.map((cat) => {
            const Icon = CAT_ICON_MAP[cat.id] || Layers;
            const isCatActive = categorySlug === cat.slug;
            const hasActiveChild = cat.children?.some(sub => sub.slug === categorySlug);
            const isExpanded = expandedCatIds.includes(cat.id);

            return (
              <div key={cat.id} className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-2xs">
                {/* Level 1 Header */}
                <div
                  onClick={() => setCategorySlug(cat.slug)}
                  className={`flex items-center justify-between p-2.5 text-xs font-bold transition-all cursor-pointer ${
                    isCatActive
                      ? 'bg-primary-50 text-primary-700'
                      : hasActiveChild
                      ? 'text-primary-700 bg-primary-50/40'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                      isCatActive || hasActiveChild ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-normal px-1.5 py-0.5 rounded bg-gray-50">
                      {cat.children?.length || 0}
                    </span>
                    {cat.children && (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(cat.id, e)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded"
                        title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                      >
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Level 2 Subcategories */}
                {isExpanded && cat.children && (
                  <div className="p-2 pt-0.5 space-y-1 bg-gray-50/50 border-t border-gray-100">
                    {cat.children.map((sub) => {
                      const isSubActive = categorySlug === sub.slug;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setCategorySlug(sub.slug)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-primary-600 text-white font-bold shadow-2xs'
                              : 'text-gray-600 hover:text-primary-600 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isSubActive ? 'text-white' : 'text-gray-300'}>↳</span>
                            <span>{sub.name}</span>
                          </div>
                          {isSubActive && (
                            <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full">
                              Đang chọn
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Khu vực
        </Label>
        <select
          className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 cursor-pointer"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">Tất cả khu vực</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Merchant Tier Filter (Hạng Đối Tác Sàn M1 - M4) */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-primary-600" />
            Hạng Đối Tác Cho Thuê
          </Label>
          {merchantTier && (
            <button
              type="button"
              onClick={() => setMerchantTier('')}
              className="text-[11px] font-semibold text-primary-600 hover:underline cursor-pointer"
            >
              Tất cả
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {MERCHANT_TIERS.map((t) => {
            const isSelected = merchantTier === t.tier;
            return (
              <button
                key={t.tier}
                type="button"
                onClick={() => setMerchantTier(isSelected ? '' : t.tier)}
                className={`flex items-center justify-center p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-600 border-primary-600 text-white shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                {t.badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            Đánh Giá Tối Thiểu
          </Label>
          {rating && (
            <button
              type="button"
              onClick={() => setRating(null)}
              className="text-[11px] font-semibold text-primary-600 hover:underline cursor-pointer"
            >
              Tất cả
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {[
            { label: 'Tất cả', val: null },
            { label: '4.0★+', val: 4.0 },
            { label: '4.5★+', val: 4.5 },
          ].map((item) => {
            const isSelected = rating === item.val;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setRating(item.val)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-white shadow-2xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>


      {/* Dynamic EAV Filters */}
      {availableAttributes.length > 0 && (
        <div className="pt-4 border-t border-gray-100 space-y-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Thuộc tính
          </h3>
          {availableAttributes.map((attr) => (
            <div key={attr.id} className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">{attr.name}</Label>
              {attr.type === 'options' && (
                <div className="flex flex-wrap gap-2">
                  {attr.options?.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleEavFilter(attr.id, opt)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        eavFilters[attr.id] === opt
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Check Delivery Mock */}
      <div className="pt-4 border-t border-gray-100">
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800 font-medium mb-2 text-sm">
            <Truck className="h-4 w-4" />
            Kiểm tra giao hàng
          </div>
          <p className="text-xs text-blue-600 mb-3">
            Nhập địa chỉ của bạn để xem đối tác có hỗ trợ giao tận nơi không.
          </p>
          <div className="flex gap-2">
            <Input placeholder="Nhập địa chỉ..." className="h-8 text-xs bg-white" />
            <Button size="sm" variant="secondary" className="h-8">Kiểm tra</Button>
          </div>
        </div>
      </div>

      {/* Reset All Filters Button */}
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 text-xs font-semibold text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 cursor-pointer"
          onClick={resetFilters}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Đặt lại tất cả bộ lọc
        </Button>
      </div>
    </div>
  );
}
