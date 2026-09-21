import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { categories } from '@/entities/product/product.mock';
import { cn } from '@/shared/lib/utils';

export function MegaMenuNav() {
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

        <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
          Về chúng tôi
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="p-6 border-b border-gray-100 text-left">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-4">
              <Link to="/" className="block p-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50">
                Trang chủ
              </Link>
              
              <div className="px-3">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Danh mục
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <Link
                        to={`/catalog?category=${cat.slug}`}
                        className="block py-2 text-base font-medium text-gray-900"
                      >
                        {cat.name}
                      </Link>
                      {cat.children && (
                        <div className="ml-4 border-l border-gray-200 pl-4 space-y-2 mt-2 mb-4">
                          {cat.children.map((sub) => (
                            <Link
                              key={sub.id}
                              to={`/catalog?category=${sub.slug}`}
                              className="block text-sm text-gray-600 hover:text-primary-600"
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
