import { Search, Truck, Layers, Car, Camera, Shirt, ChevronDown } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { categories } from '@/entities/product/product.mock';
import { useCatalogFilterStore } from './useCatalogFilterStore';
import { useMemo, useState } from 'react';

const DISTRICTS = ['Quận 1', 'Quận 3', 'Đống Đa', 'Thủ Đức'];

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
    eavFilters, toggleEavFilter
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
          className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">Tất cả khu vực</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
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
    </div>
  );
}
