import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ProductCard } from '@/shared/ui/ProductCard';
import { PageSkeleton } from '@/shared/ui/PageSkeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { HeroSection } from '@/features/home/HeroSection';
import { BenefitSection } from '@/features/home/BenefitSection';
import { mockProducts } from '@/entities/product/product.mock';

export function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 6);
  const newProducts = [...mockProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="animate-fade-in pb-16">
      <HeroSection />
      <BenefitSection />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
            <p className="text-gray-500 mt-1">Các sản phẩm được đánh giá cao nhất</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/catalog')} className="hidden sm:flex group">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {isLoading ? (
          <PageSkeleton variant="cards" />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="Không có sản phẩm" description="Hiện chưa có sản phẩm nổi bật nào." />
        )}
      </section>

      {/* New Products */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-gray-50/50 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mới nhất</h2>
            <p className="text-gray-500 mt-1">Khám phá các sản phẩm vừa được đăng tải</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/catalog')} className="hidden sm:flex group">
            Xem tất cả
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {isLoading ? (
          <PageSkeleton variant="cards" />
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState title="Không có sản phẩm" description="Hiện chưa có sản phẩm mới nào." />
        )}
      </section>
    </div>
  );
}
