import { useEffect, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/shared/ui/ProductCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { VirtualTable } from '@/shared/ui/VirtualTable';
import { formatCurrency } from '@/shared/lib/utils';
import { catalogApi, type PaginatedResult } from '@/api/catalog.api';
import { type Product } from '@/entities/product/product.types';
import { useCatalogFilterStore } from './useCatalogFilterStore';

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 380;

function sortParam(sortBy: string): string | undefined {
  if (sortBy === 'price_asc')  return 'rentPrice,asc';
  if (sortBy === 'price_desc') return 'rentPrice,desc';
  return 'createdAt,desc'; // newest
}

export function ProductGrid() {
  const {
    query,
    categorySlug,
    districtFilter,
    merchantTier,
    rating,
    sortBy,
    minPrice,
    maxPrice,
    viewMode,
    eavFilters,
    resetFilters,
  } = useCatalogFilterStore();

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<PaginatedResult<Product> | null>(null);

  // Reset to page 0 whenever any filter changes
  useEffect(() => {
    setPage(0);
  }, [query, categorySlug, districtFilter, merchantTier, rating, sortBy, minPrice, maxPrice, eavFilters]);

  // ── Debounced search ─────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(
    (currentPage: number) => {
      setIsLoading(true);
      const params = {
        keyword:      query || undefined,
        category:     categorySlug || undefined,
        district:     districtFilter || undefined,
        merchantTier: merchantTier || undefined,
        rating:       rating ?? undefined,
        minPrice:     minPrice ?? undefined,
        maxPrice:     maxPrice ?? undefined,
        sort:         sortParam(sortBy),
        eavFilters:   Object.keys(eavFilters).length > 0 ? eavFilters : undefined,
        page:         currentPage,
        size:         PAGE_SIZE,
      };
      catalogApi
        .searchProducts(params)
        .then((data) => {
          setResult(data);
        })
        .catch(() => {
          setResult(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [query, categorySlug, districtFilter, merchantTier, rating, sortBy, minPrice, maxPrice, eavFilters]
  );


  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(page);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchProducts, page]);

  // ── Skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200 animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const products = result?.content ?? [];
  const totalPages = result?.totalPages ?? 0;
  const totalElements = result?.totalElements ?? 0;

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 mt-4">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn."
          action={{ label: 'Xóa bộ lọc', onClick: resetFilters }}
        />
      </div>
    );
  }

  const tableColumns = [
    {
      header: 'Thiết bị & Thông tin',
      accessorKey: 'name' as const,
      width: '38%',
      cell: (item: Product) => (
        <Link to={`/products/${item.id}`} className="flex items-center gap-3 py-1 group">
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-10 w-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
          />
          <div className="min-w-0">
            <span className="font-semibold text-gray-900 group-hover:text-primary-600 truncate block text-xs sm:text-sm">
              {item.name}
            </span>
            <span className="text-[11px] text-gray-400 block truncate">
              {item.district || item.city} • {item.rating} ★
            </span>
          </div>
        </Link>
      ),
    },
    {
      header: 'Đối tác cho thuê',
      accessorKey: 'merchant' as const,
      width: '22%',
      cell: (item: Product) => (
        <div className="flex items-center gap-1.5 py-1">
          <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
            {item.merchant.name}
          </span>
          <TierBadge role="MERCHANT" tier={item.merchant.tier || 'M1'} size="sm" />
        </div>
      ),
    },
    {
      header: 'Giá thuê / ngày',
      accessorKey: 'pricePerDay' as const,
      width: '18%',
      cell: (item: Product) => (
        <span className="font-bold text-primary-600 text-xs sm:text-sm">
          {formatCurrency(item.pricePerDay)}
        </span>
      ),
    },
    {
      header: 'Đặt cọc',
      accessorKey: 'depositAmount' as const,
      width: '12%',
      cell: (item: Product) => (
        <span className="text-xs text-gray-600 font-medium">
          {item.depositAmount > 0 ? formatCurrency(item.depositAmount) : 'Miễn cọc'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      accessorKey: 'id' as const,
      width: '10%',
      cell: (item: Product) => (
        <Link to={`/products/${item.id}`}>
          <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs font-semibold hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300">
            Chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      {/* Result count */}
      <p className="text-sm text-gray-500 mb-4 flex items-center justify-between">
        <span>
          Hiển thị{' '}
          <span className="font-semibold text-gray-800">{products.length}</span>
          {' '}trong{' '}
          <span className="font-semibold text-gray-800">{totalElements}</span> sản phẩm
        </span>
      </p>

      {/* Grid or Virtual Table */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <VirtualTable
            data={products}
            columns={tableColumns}
            rowHeight={58}
            className="border-0 rounded-none"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="gap-1"
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>

          {Array.from({ length: totalPages }, (_, i) => {
            // Show first, last, current ±1
            if (
              i === 0 ||
              i === totalPages - 1 ||
              Math.abs(i - page) <= 1
            ) {
              return (
                <Button
                  key={i}
                  variant={i === page ? 'default' : 'outline'}
                  size="sm"
                  className="w-9 px-0"
                  onClick={() => setPage(i)}
                  aria-label={`Trang ${i + 1}`}
                  aria-current={i === page ? 'page' : undefined}
                >
                  {i + 1}
                </Button>
              );
            }
            // Ellipsis — only once per gap
            if (i === 1 && page > 2) {
              return (
                <span key="ellipsis-left" className="px-1 text-gray-400 select-none">
                  …
                </span>
              );
            }
            if (i === totalPages - 2 && page < totalPages - 3) {
              return (
                <span key="ellipsis-right" className="px-1 text-gray-400 select-none">
                  …
                </span>
              );
            }
            return null;
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="gap-1"
            aria-label="Trang tiếp"
          >
            Tiếp
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
