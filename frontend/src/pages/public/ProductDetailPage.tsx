import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Store, Star, Lock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ImageGallery } from '@/shared/ui/ImageGallery';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { PageSkeleton } from '@/shared/ui/PageSkeleton';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { mockProducts, categories } from '@/entities/product/product.mock';
import { formatCurrency, sleep } from '@/shared/lib/utils';
import { RentalCalculator } from '@/features/rental/RentalCalculator';

// Luật 1: KHÔNG VIẾT LOGIC. Trang ProductDetailPage hiện tại chỉ đóng vai trò ráp nối.
export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role, tier } = useAuthStore();
  
  const [product, setProduct] = useState(mockProducts.find(p => p.id === id));
  const [isLoading, setIsLoading] = useState(!product);

  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        await sleep(800);
        const p = mockProducts.find(p => p.id === id);
        if (p) setProduct(p);
        setIsLoading(false);
      };
      fetchProduct();
    }
  }, [id, product]);

  const activeCategory = useMemo(() => {
    if (!product) return null;
    for (const cat of categories) {
      if (cat.id === product.categoryId) return cat;
      if (cat.children) {
        const sub = cat.children.find((c) => c.id === product.categoryId);
        if (sub) return sub;
      }
    }
    return null;
  }, [product]);

  if (isLoading) return <PageSkeleton />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h1>
        <p className="text-gray-500 mb-6">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/catalog">
          <Button>Quay lại danh mục</Button>
        </Link>
      </div>
    );
  }

  const isGuestG1 = role === 'GUEST' && tier === 'G1';

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/catalog" className="flex items-center hover:text-primary-600 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Danh mục
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Gallery & Info */}
          <div className="flex-1 min-w-0 space-y-10">
            <ImageGallery images={product.images} />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge type="item" status={product.status} />
                {product.featured && (
                  <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-800">
                    Nổi bật
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{product.merchant.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <span className="font-medium text-gray-900">{product.merchant.rating}</span>
                  <span className="text-gray-400">({product.merchant.totalReviews} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{product.district}, {product.city}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* EAV Specs Table with Guest Friction */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Thông số kỹ thuật</h2>
              
              <div className="relative">
                <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all ${isGuestG1 ? 'blur-sm select-none' : ''}`}>
                  <div className="divide-y divide-slate-100 text-sm">
                    {product.eavValues.map((eav) => {
                      const attrDef = activeCategory?.availableAttributes.find(a => a.id === eav.attributeId);
                      return (
                        <div key={eav.attributeId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 hover:bg-slate-50/80 transition-colors">
                          <span className="font-medium text-slate-500 text-xs sm:text-sm">
                            {attrDef?.name || eav.attributeId}
                          </span>
                          <span className="font-bold text-slate-900 mt-0.5 sm:mt-0 text-sm">
                            {eav.value.toString()} {attrDef?.unit || ''}
                          </span>
                        </div>
                      );
                    })}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 bg-cyan-50/50">
                      <span className="font-medium text-slate-600 text-xs sm:text-sm">
                        Giá trị tài sản niêm yết (Gốc)
                      </span>
                      <span className="font-extrabold text-[#0284C7] mt-0.5 sm:mt-0 text-base">
                        {formatCurrency(product.depositAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {isGuestG1 && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[3px] rounded-2xl border border-slate-200">
                    <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm border border-slate-100">
                      <div className="h-12 w-12 bg-cyan-50 rounded-2xl flex items-center justify-center mb-3 text-[#06B6D4] border border-cyan-100">
                        <Lock className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1 text-base">Đăng nhập để xem</h3>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Thông số kỹ thuật chi tiết chỉ dành cho thành viên đã đăng nhập hệ thống RentalShop.
                      </p>
                      <Link to="/login">
                        <Button className="font-bold bg-gradient-to-r from-[#06B6D4] to-[#2563EB] hover:from-[#0891B2] hover:to-[#1D4ED8] text-white rounded-xl shadow-md shadow-cyan-500/20">
                          Đăng nhập ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Rental Calculator Component */}
          <div className="w-full lg:w-[400px] shrink-0">
            <RentalCalculator product={product} />
          </div>

        </div>
      </div>
    </div>
  );
}
