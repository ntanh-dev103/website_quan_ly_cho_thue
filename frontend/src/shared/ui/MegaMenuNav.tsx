import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, Package } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { categories } from '@/entities/product/product.mock';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/entities/user/useAuthStore';

export function MegaMenuNav() {
  const { role } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <>
      {/* Desktop Mega Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
          Trang chủ
        </Link>

        {/* Mega Menu Dropdown */}
        <div
          className="group relative"
          onMouseEnter={() => setActiveCategory(categories[0]?.id)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <Link
            to="/catalog"
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors py-5"
          >
            Danh mục
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </Link>

          {/* Dropdown Content */}
          <div className="absolute left-0 top-full -mt-1 hidden w-[800px] rounded-2xl border border-gray-200 bg-white p-6 shadow-xl group-hover:flex">
            {/* Level 1: Categories */}
            <div className="w-1/3 border-r border-gray-100 pr-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Danh mục chính
              </h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onMouseEnter={() => setActiveCategory(cat.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        activeCategory === cat.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {cat.name}
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Level 2: Subcategories (Mocking 2-level for now, easily extendable to 4) */}
            <div className="w-2/3 pl-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Phân loại
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.find((c) => c.id === activeCategory)?.children?.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/catalog?category=${sub.slug}`}
                    className="block rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="text-sm font-medium text-gray-900">{sub.name}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      Thuê {sub.name.toLowerCase()} chất lượng cao
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Link to="/catalog" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
          Tất cả thiết bị
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col h-full">
            <SheetHeader className="p-5 border-b border-gray-100 text-left flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white">
                  <Package className="h-4 w-4" />
                </div>
                <SheetTitle className="text-base font-bold text-gray-900">RentalShop</SheetTitle>
              </div>
            </SheetHeader>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <Link to="/" className="block px-3 py-2 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                Trang chủ
              </Link>
              <Link to="/catalog" className="block px-3 py-2 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                Tất cả thiết bị
              </Link>

              {/* Role Quick Links for Mobile */}
              {role === 'MERCHANT' && (
                <div className="px-3 py-2 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-600 uppercase block mb-1">Cửa hàng của bạn</span>
                  <Link to="/merchant" className="text-sm font-semibold text-purple-900 hover:underline block">
                    Bảng điều khiển đối tác →
                  </Link>
                </div>
              )}
              {role === 'ADMIN' && (
                <div className="px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-[11px] font-bold text-red-600 uppercase block mb-1">Hệ thống quản trị</span>
                  <Link to="/admin" className="text-sm font-semibold text-red-900 hover:underline block">
                    Vào trang Quản trị sàn →
                  </Link>
                </div>
              )}
              
              <div className="px-3 pt-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Danh mục chính
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        to={`/catalog?category=${cat.slug}`}
                        className="block py-1.5 text-sm font-medium text-gray-800 hover:text-primary-600"
                      >
                        {cat.name}
                      </Link>
                      {cat.children && (
                        <div className="ml-3 border-l-2 border-gray-100 pl-3 space-y-1.5 my-1.5">
                          {cat.children.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/catalog?category=${sub.slug}`}
                              className="block text-xs text-gray-500 hover:text-primary-600"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
