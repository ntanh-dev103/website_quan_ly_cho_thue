import { Link } from 'react-router-dom';
import { Package, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shadow-md shadow-primary-600/20">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RentalShop</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Nền tảng cho thuê đồ dùng trực tuyến hàng đầu Việt Nam. Tiết kiệm chi phí, bảo vệ môi trường, kết nối cộng đồng.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Về chúng tôi</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Giới thiệu</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Tuyển dụng</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Tin tức</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Hỗ trợ khách hàng</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Quy định an toàn</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                <span>support@rentalshop.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RentalShop. Bản quyền đã được bảo hộ.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="#" className="hover:text-primary-600">Tiếng Việt</Link>
            <span>|</span>
            <Link to="#" className="hover:text-primary-600">English</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
