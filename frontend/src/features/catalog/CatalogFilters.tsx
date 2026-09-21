import { Search, Truck } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { categories } from '@/entities/product/product.mock';
import { useCatalogFilterStore } from './useCatalogFilterStore';
import { useMemo } from 'react';

const DISTRICTS = ['Quận 1', 'Quận 3', 'Đống Đa', 'Thủ Đức'];

export function CatalogFilters() {
  const {
    query, setQuery,
    categorySlug, setCategorySlug,
    districtFilter, setDistrictFilter,
    eavFilters, toggleEavFilter
  } = useCatalogFilterStore();

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

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          Danh mục
        </Label>
        <div className="space-y-1">
          <button
            onClick={() => setCategorySlug('')}
            className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
              !categorySlug ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => setCategorySlug(cat.slug)}
                className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                  categorySlug === cat.slug ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
              {cat.children && (
                <div className="ml-4 border-l border-gray-200 pl-2 mt-1 space-y-1">
                  {cat.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setCategorySlug(sub.slug)}
                      className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                        categorySlug === sub.slug ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
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
