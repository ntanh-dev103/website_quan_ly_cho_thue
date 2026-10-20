import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  ShoppingBag, 
  PackageOpen,
  Store,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ProductCard } from '@/shared/ui/ProductCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { HeroSection } from '@/features/home/HeroSection';
import { QuickSearchFilterBar } from '@/features/home/QuickSearchFilterBar';
import { CategoryQuickLinks } from '@/features/home/CategoryQuickLinks';
import { TierBenefitSection } from '@/features/home/TierBenefitSection';
import { CuratedKitsSection } from '@/features/home/CuratedKitsSection';
import { mockProducts } from '@/entities/product/product.mock';
import { type Product } from '@/entities/product/product.types';
import { catalogApi } from '@/api/catalog.api';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';

type SortFilter = 'newest' | 'popular' | 'price_asc';

export function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest');
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  
  const { items, setIsOpen: setCartOpen } = useGhostCartStore();
  const totalItems = items.length;

  // Load real products from Backend API with graceful mock fallback
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await catalogApi.getProducts();
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('API getProducts offline or error, using mock data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 6 Featured Products (or top 6 if no explicit featured)
  const featuredProducts = useMemo(() => {
    const list = products.filter((p) => p.featured);
    return list.length > 0 ? list.slice(0, 6) : products.slice(0, 6);
  }, [products]);

  // 8 Newest Products with Interactive Safe Sorting
  const sortedNewestProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortFilter === 'popular') {
        return (b.merchant?.totalReviews || 0) - (a.merchant?.totalReviews || 0);
      }
      if (sortFilter === 'price_asc') {
        return a.pricePerDay - b.pricePerDay;
      }
      // Default 'newest'
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, 8);
  }, [products, sortFilter]);

  const handleFeaturedScroll = (direction: 'left' | 'right') => {
    if (featuredScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      featuredScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in pb-16 bg-[#F9FAFB] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. QUICK SEARCH & MULTI-CRITERIA FILTER BAR */}
      <QuickSearchFilterBar />

      {/* 3. CATEGORY QUICK-LINKS (Promoted directly after search) */}
      <CategoryQuickLinks />

      {/* 4. TIER BENEFIT SECTION (USP Đồ Án: Cơ chế miễn cọc đa tầng) */}
      <div className="bg-white border-y border-gray-200/80">
        <TierBenefitSection />
      </div>

      {/* 5. SẢN PHẨM NỔI BẬT (Horizontal Scroll Row, 6 items) */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
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

      {/* 6. CURATED KITS (Lifestyle Bundling) */}
      <div className="bg-white border-y border-gray-200/80">
        <CuratedKitsSection />
      </div>

      {/* 7. MỚI NHẤT TRÊN SÀN (Clean Canvas Grid, 8 items) */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header + Filter Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 border-b border-gray-200/80 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Mới nhất trên sàn
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Đồ dùng và phương tiện vừa được các đối tác đăng kiểm duyệt trên sàn RentHub
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 shadow-2xs">
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

        {/* Grid: Desktop 4 columns, Tablet 2 columns, Mobile 2 columns */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3 bg-white p-3 rounded-xl border border-gray-100 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3.5 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-1/2 pt-2" />
              </div>
            ))}
          </div>
        ) : sortedNewestProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
      </section>

      {/* 8. B2B MERCHANT PARTNER CTA */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200/90 bg-white p-6 sm:p-10 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-bold mb-3">
              <Store className="h-3.5 w-3.5" />
              <span>Chương trình Đối tác Cho thuê RentHub Partner</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Bạn là chủ sở hữu thiết bị hoặc cơ sở kinh doanh cho thuê?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              Gia nhập mạng lưới Merchant RentHub để tiếp cận hàng nghìn khách thuê đã xác minh tín nhiệm. Hoa hồng cạnh tranh chỉ từ 2% - 15% theo cấp bậc đối tác M1 - M4.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Bảo hiểm tài sản & Ký số điện tử</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Quản lý kho sê-ri & bảo trì tự động</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Đối soát doanh thu minh bạch</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Button
              size="lg"
              onClick={() => navigate('/partner')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 shadow-md shadow-primary-600/20 group"
            >
              <span>Đăng ký mở gian hàng (M1)</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/partner')}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
            >
              <span>Tìm hiểu chính sách đối tác</span>
            </Button>
          </div>
        </div>
      </section>

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
