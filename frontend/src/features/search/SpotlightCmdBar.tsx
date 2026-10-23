import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, Layers, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { catalogApi } from '@/api/catalog.api';
import { categories } from '@/entities/product/product.mock';
import { type Product } from '@/entities/product/product.types';
import { formatCurrency } from '@/shared/lib/utils';

interface SpotlightCmdBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StaticNavPage {
  title: string;
  url: string;
  category: 'Trang';
  description: string;
}

const STATIC_PAGES: StaticNavPage[] = [
  { title: 'Trang chủ RentHub', url: '/', category: 'Trang', description: 'Trang chủ nền tảng cho thuê bảo đảm' },
  { title: 'Danh mục tất cả sản phẩm', url: '/catalog', category: 'Trang', description: 'Khám phá hàng ngàn đồ dùng cho thuê' },
  { title: 'Đăng nhập tài khoản', url: '/login', category: 'Trang', description: 'Quản lý đơn thuê và điểm tín nhiệm' },
  { title: 'Đăng ký thành viên', url: '/register', category: 'Trang', description: 'Tạo tài khoản nhận ngay hạng C1' },
  { title: 'Trở thành Đối tác cho thuê', url: '/partner', category: 'Trang', description: 'Mở gian hàng kinh doanh B2B & Cá nhân' },
];

const DEBOUNCE_MS = 300;

export function SpotlightCmdBar({ isOpen, onClose }: SpotlightCmdBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setApiProducts([]);
    }
  }, [isOpen]);

  // Global shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced real-API search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (!trimmed) {
      setApiProducts([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      catalogApi
        .searchProducts({ keyword: trimmed, size: 5, page: 0 })
        .then((res) => setApiProducts(res.content))
        .catch(() => setApiProducts([]));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Products: prefer API results; fall back to empty when query is active but API hasn't resolved yet
  const matchingProducts = apiProducts.length > 0
    ? apiProducts.slice(0, 4)
    : [];

  // Show placeholder "suggestions" when no query typed yet — use popular categories
  const showPopularProducts = !normalizedQuery;

  // Filtered Categories
  const allSubcategories = categories.flatMap((c) => c.children || [c]);
  const matchingCategories = normalizedQuery
    ? allSubcategories.filter((c) => c.name.toLowerCase().includes(normalizedQuery)).slice(0, 4)
    : categories.slice(0, 3);

  // Filtered Pages
  const matchingPages = normalizedQuery
    ? STATIC_PAGES.filter((p) => p.title.toLowerCase().includes(normalizedQuery)).slice(0, 3)
    : STATIC_PAGES.slice(0, 2);

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-gray-900/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm nhanh"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-gray-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-primary-600 shrink-0 mr-3" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            id="spotlight-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && normalizedQuery) {
                handleSelect(`/catalog?q=${encodeURIComponent(normalizedQuery)}`);
              }
            }}
            placeholder="Tìm thiết bị, danh mục, trang... (VD: máy ảnh, vest, ô tô)"
            className="w-full bg-transparent text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
            aria-label="Từ khóa tìm kiếm"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 mr-2"
              aria-label="Xóa từ khóa"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4" role="listbox">

          {/* Section: Sản phẩm */}
          {(matchingProducts.length > 0 || showPopularProducts) && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Package className="h-3.5 w-3.5 text-primary-500" aria-hidden="true" />
                <span>
                  {normalizedQuery
                    ? `Sản phẩm (${matchingProducts.length})`
                    : 'Danh mục nổi bật'}
                </span>
              </div>

              {/* API results */}
              {matchingProducts.length > 0 && (
                <div className="space-y-1 mt-1">
                  {matchingProducts.map((p) => (
                    <div
                      key={p.id}
                      role="option"
                      aria-selected="false"
                      onClick={() => handleSelect(`/products/${p.id}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=80&q=60';
                          }}
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 block truncate">
                            {p.name}
                          </span>
                          <span className="text-xs text-gray-400 block truncate">
                            {p.merchant.name} • {p.district || p.city}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-primary-600">
                          {formatCurrency(p.pricePerDay)}/ngày
                        </span>
                        <CornerDownLeft className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* "Search in catalog" CTA when query is typed */}
              {normalizedQuery && matchingProducts.length === 0 && (
                <div
                  role="option"
                  aria-selected="false"
                  onClick={() => handleSelect(`/catalog?q=${encodeURIComponent(normalizedQuery)}`)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group text-sm text-gray-700"
                >
                  <Search className="h-4 w-4 text-primary-500 shrink-0" aria-hidden="true" />
                  <span>
                    Tìm kiếm{' '}
                    <span className="font-semibold text-gray-900">"{query}"</span>{' '}
                    trong danh mục
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" aria-hidden="true" />
                </div>
              )}
            </div>
          )}

          {/* Section: Danh mục */}
          {matchingCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <span>Danh mục</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingCategories.map((c) => (
                  <div
                    key={c.id}
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSelect(`/catalog?category=${c.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Layers className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-primary-600">
                        {c.name}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trang điều hướng */}
          {matchingPages.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>Trang & Lối tắt</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingPages.map((pg) => (
                  <div
                    key={pg.url}
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSelect(pg.url)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-primary-600 block">
                        {pg.title}
                      </span>
                      <span className="text-xs text-gray-400 block truncate">{pg.description}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0 ml-3" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">ESC</kbd>{' '}
              để đóng
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">↵</kbd>{' '}
              để tìm kiếm
            </span>
          </div>
          <span
            className="text-primary-600 font-semibold cursor-pointer hover:underline"
            onClick={() => handleSelect('/catalog')}
          >
            Xem tất cả sản phẩm →
          </span>
        </div>
      </div>
    </div>
  );
}
