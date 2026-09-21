import { useMemo, useEffect, useState } from 'react';
import { ProductCard } from '@/shared/ui/ProductCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/button';
import { mockProducts, categories } from '@/entities/product/product.mock';
import { useCatalogFilterStore } from './useCatalogFilterStore';

export function ProductGrid() {
  const { query, categorySlug, districtFilter, sortBy, eavFilters, resetFilters } = useCatalogFilterStore();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [query, categorySlug, districtFilter, sortBy, eavFilters]);

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

  const filteredProducts = useMemo(() => {
    let result = mockProducts;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (activeCategory) {
      result = result.filter(
        (p) => p.categoryId === activeCategory.id || 
        categories.find(c => c.id === activeCategory.id)?.children?.some(sub => sub.id === p.categoryId)
      );
    }

    if (districtFilter) {
      result = result.filter((p) => p.district === districtFilter);
    }

    Object.entries(eavFilters).forEach(([attrId, value]) => {
      if (value) {
        result = result.filter((p) =>
          p.eavValues.some((v) => v.attributeId === attrId && v.value.toString() === value)
        );
      }
    });

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [query, activeCategory, districtFilter, eavFilters, sortBy]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 mt-4">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn."
          action={{
            label: 'Xóa bộ lọc',
            onClick: resetFilters
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filteredProducts.length >= 6 && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Trước</Button>
            <Button variant="default" size="sm" className="w-9 px-0">1</Button>
            <Button variant="outline" size="sm" className="w-9 px-0">2</Button>
            <Button variant="outline" size="sm">Tiếp</Button>
          </div>
        </div>
      )}
    </>
  );
}
