import { useNavigate } from 'react-router-dom';
import { Shirt, Laptop, Car, Home as HomeIcon, Camera, PartyPopper } from 'lucide-react';

interface CategoryTileItem {
  id: string;
  name: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
  itemCount: string;
}

const CATEGORIES_DATA: CategoryTileItem[] = [
  { id: 'fashion', name: 'Thời trang', query: 'thoi-trang', icon: Shirt, itemCount: '420+ món' },
  { id: 'tech', name: 'Laptop & PC', query: 'laptop', icon: Laptop, itemCount: '180+ máy' },
  { id: 'vehicle', name: 'Phương tiện', query: 'phuong-tien', icon: Car, itemCount: '150+ xe' },
  { id: 'camping', name: 'Lều & Dã ngoại', query: 'da-ngoai', icon: HomeIcon, itemCount: '95+ bộ' },
  { id: 'camera', name: 'Máy ảnh & Flycam', query: 'may-anh', icon: Camera, itemCount: '210+ thiết bị' },
  { id: 'party', name: 'Sự kiện & Tiệc', query: 'su-kien', icon: PartyPopper, itemCount: '130+ gói' },
];

export function CategoryQuickLinks() {
  const navigate = useNavigate();

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Khám phá theo Danh mục
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Lựa chọn danh mục phù hợp với nhu cầu công việc, sự kiện hoặc kỳ nghỉ của bạn
        </p>
      </div>

      {/* Grid: Desktop 6 columns, Mobile 3 columns */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => navigate(`/catalog?category=${cat.query}`)}
              className="group flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-gray-200/90 bg-white hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 text-center"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary-50/70 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <span className="font-semibold text-xs sm:text-sm mt-3 text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5">
                {cat.itemCount}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
