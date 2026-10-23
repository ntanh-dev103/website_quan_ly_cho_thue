import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { CatalogFilters } from '@/features/catalog/CatalogFilters';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { useCatalogFilterStore } from '@/features/catalog/useCatalogFilterStore';
import { categories } from '@/entities/product/product.mock';

// CatalogPage is a layout-only component — all data logic lives in ProductGrid & useCatalogFilterStore.
export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const {
    categorySlug,
    sortBy,
    setSortBy,
    setCategorySlug,
    setQuery,
    setDistrictFilter,
    setMinPrice,
    setMaxPrice,
    viewMode,
    setViewMode,
  } = useCatalogFilterStore();


  // Sync initial URL params to store (runs once on mount / URL change)
  useEffect(() => {
    const query    = searchParams.get('q');
    const cat      = searchParams.get('category');
    const dist     = searchParams.get('district');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    if (query)    setQuery(query);
    if (cat)      setCategorySlug(cat);
    if (dist)     setDistrictFilter(dist);
    if (minPriceParam) {
      const v = Number(minPriceParam);
      if (v > 0) setMinPrice(v);
    }
    if (maxPriceParam) {
      const v = Number(maxPriceParam);
      if (v > 0) setMaxPrice(v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeCategory ? activeCategory.name : 'Tất cả sản phẩm'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort selector */}
            <div className="relative">
              <select
                id="catalog-sort"
                className="h-10 appearance-none rounded-xl border border-[#D7E5F0] bg-white pl-3.5 pr-8 py-2 text-xs sm:text-sm font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 focus:border-[#06B6D4] cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Mới nhất trên sàn</option>
                <option value="price_asc">Giá thuê: Thấp đến Cao</option>
                <option value="price_desc">Giá thuê: Cao đến Thấp</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle: Grid vs Virtual Table */}
            <div className="hidden sm:flex items-center rounded-xl border border-[#D7E5F0] bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Chế độ lưới sản phẩm"
                aria-label="Chế độ lưới"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Chế độ bảng ảo hóa (@tanstack/react-virtual 60fps)"
                aria-label="Chế độ bảng ảo hóa"
              >
                <List className="h-4 w-4" />
              </button>
            </div>


            {/* Mobile Sheet Trigger */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Bộ lọc
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[350px] overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                  </SheetHeader>
                  <CatalogFilters />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <CatalogFilters />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ProductGrid />
          </div>
        </div>

      </div>
    </div>
  );
}
