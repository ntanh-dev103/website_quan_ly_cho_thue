import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  PackageOpen 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ProductCard } from '@/shared/ui/ProductCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { HeroSection } from '@/features/home/HeroSection';
import { CuratedKitsSection } from '@/features/home/CuratedKitsSection';
import { CategoryQuickLinks } from '@/features/home/CategoryQuickLinks';
import { mockProducts } from '@/entities/product/product.mock';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';

type SortFilter = 'newest' | 'popular' | 'price_asc';

export function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest');
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  
  const { items, setIsOpen: setCartOpen } = useGhostCartStore();
  const totalItems = items.length;

  // Skeleton loading: 800ms on initial mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Section 4: 6 Featured Products
  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 6);

  // Section 5: 8 Newest Products with Interactive Sorting
  const sortedNewestProducts = [...mockProducts].sort((a, b) => {
    if (sortFilter === 'popular') {
      return (b.merchant.totalReviews || 0) - (a.merchant.totalReviews || 0);
    }
    if (sortFilter === 'price_asc') {
      return a.pricePerDay - b.pricePerDay;
    }
    // Default 'newest'
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 8);

  const handleFeaturedScroll = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      featuredScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in pb-16 bg-[#F9FAFB] min-h-screen">
      
      {/* SECTION 2: HERO SECTION */}
      <HeroSection />

      {/* SECTION 3: CURATED KITS (Lifestyle Bundling) */}
      <CuratedKitsSection />

      {/* SECTION 4: SẢN PHẨM NỔI BẬT (Horizontal Scroll Row, 6 items) */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-accent-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="h-4 w-4" />
              <span>Được thuê nhiều nhất</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Sản phẩm nổi bật
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Thiết bị chính hãng, bảo hiểm tài sản minh bạch từ các đối tác kiểm định M1 - M3
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll buttons for desktop */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFeaturedScroll('left')}
                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 shadow-2xs transition-all active:scale-95"
                aria-label="Cuộn trái"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleFeaturedScroll('right')}
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

        {/* Skeleton loading vs Products Row */}
        {isLoading ? (
          <div className="flex gap-4 sm:gap-6 overflow-x-hidden pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-[220px] shrink-0 space-y-3 bg-white p-3 rounded-xl border border-gray-100 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3.5 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2 pt-2" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div 
            ref={featuredScrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="snap-start shrink-0">
                <ProductCard product={product} fixedWidth={true} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<PackageOpen className="h-10 w-10 text-gray-400" />}
            title="Chưa có sản phẩm" 
            description="Hiện chưa có sản phẩm nổi bật nào trên sàn." 
          />
        )}
      </section>

      {/* SECTION 5: MỚI NHẤT TRÊN SÀN (Responsive Grid, 8 items) */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-200/80 shadow-xs">
          
          {/* Header + Filter Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-1.5 text-primary-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Cập nhật liên tục</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Mới nhất trên sàn
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Đồ dùng và phương tiện vừa được các đối tác đăng kiểm duyệt trên sàn RentHub
              </p>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/90 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs">
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
                <span className="font-medium text-gray-500 hidden sm:inline">Sắp xếp:</span>
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value as SortFilter)}
                  className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="price_asc">Giá tăng dần</option>
                </select>
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

          {/* Grid: Desktop 4 columns, Tablet 2 columns, Mobile 2 columns (0.5rem gap) */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3 bg-gray-50/70 p-3 rounded-xl border border-gray-100 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3.5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 pt-2" />
                </div>
              ))}
            </div>
          ) : sortedNewestProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
              {sortedNewestProducts.map((product) => (
                <ProductCard key={product.id} product={product} fixedWidth={false} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<PackageOpen className="h-10 w-10 text-gray-400" />}
              title="Chưa có sản phẩm" 
              description="Hiện chưa có sản phẩm mới nào theo bộ lọc này." 
            />
          )}

        </div>
      </section>

      {/* SECTION 6: CATEGORY QUICK-LINKS */}
      <CategoryQuickLinks />

      {/* FLOATING CART ICON (Mobile & Desktop quick access) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-600/30 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Xem giỏ đồ thuê"
          title="Xem giỏ đồ thuê"
        >
          <ShoppingBag className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 min-w-[24px] px-1.5 items-center justify-center rounded-full bg-accent-500 text-white text-xs font-black ring-2 ring-white shadow-md animate-scale-in">
              {totalItems}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}

