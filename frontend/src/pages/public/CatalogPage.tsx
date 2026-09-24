import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { CatalogFilters } from '@/features/catalog/CatalogFilters';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { useCatalogFilterStore } from '@/features/catalog/useCatalogFilterStore';
import { categories } from '@/entities/product/product.mock';

// Luật 1: KHÔNG VIẾT LOGIC. Trang CatalogPage hiện tại chỉ đóng vai trò ráp nối Layout.
export function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categorySlug, sortBy, setSortBy, setCategorySlug, setQuery, setDistrictFilter } = useCatalogFilterStore();

  // Sync initial URL params to store
  useEffect(() => {
    const query = searchParams.get('q');
    const cat = searchParams.get('category');
    const dist = searchParams.get('district');
    
    if (query) setQuery(query);
    if (cat) setCategorySlug(cat);
    if (dist) setDistrictFilter(dist);
  }, [searchParams, setQuery, setCategorySlug, setDistrictFilter]);

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
            <div className="relative">
              <select
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
