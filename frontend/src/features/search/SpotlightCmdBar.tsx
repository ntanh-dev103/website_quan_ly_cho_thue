import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, Layers, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { mockProducts, categories } from '@/entities/product/product.mock';
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

export function SpotlightCmdBar({ isOpen, onClose }: SpotlightCmdBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Filtered Products
  const matchingProducts = normalizedQuery
    ? mockProducts.filter((p) => p.name.toLowerCase().includes(normalizedQuery)).slice(0, 4)
    : mockProducts.slice(0, 3);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-gray-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-primary-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm thiết bị, danh mục, trang hoặc phím tắt... (VD: máy ảnh, vest, ô tô)"
            className="w-full bg-transparent text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Section: Sản phẩm */}
          {matchingProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Package className="h-3.5 w-3.5 text-primary-500" />
                <span>Sản phẩm ({matchingProducts.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(`/products/${p.id}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 block truncate">
                          {p.name}
                        </span>
                        <span className="text-xs text-gray-400 block truncate">
                          {p.merchant.name} • {p.district}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-primary-600">
                        {formatCurrency(p.pricePerDay)}/ngày
                      </span>
                      <CornerDownLeft className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Danh mục */}
          {matchingCategories.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5 text-emerald-500" />
                <span>Danh mục</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingCategories.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect(`/catalog?category=${c.slug}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Layers className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-primary-600">
                        {c.name}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trang điều hướng */}
          {matchingPages.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                <span>Trang & Lối tắt</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchingPages.map((pg) => (
                  <div
                    key={pg.url}
                    onClick={() => handleSelect(pg.url)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-primary-600 block">
                        {pg.title}
                      </span>
                      <span className="text-xs text-gray-400 block truncate">{pg.description}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Dùng phím <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px]">ESC</kbd> để đóng</span>
          </div>
          <span className="text-primary-600 font-semibold cursor-pointer" onClick={() => handleSelect('/catalog')}>
            Xem tất cả sản phẩm &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
