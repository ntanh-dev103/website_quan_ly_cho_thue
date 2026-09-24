import { Link } from 'react-router-dom';
import { Compass, Facebook, Youtube, Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        
        {/* 4-column grid desktop, stacked mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Col 1: RentHub Logo (White) + Short description + Social Icons */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-500/20">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                RentHub
              </span>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Nền tảng kinh tế tuần hoàn cho thuê hàng đầu Việt Nam. Kết nối khách thuê thông thái với hệ thống đối tác xác minh uy tín. Tiết kiệm tài chính, bảo vệ môi trường.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: "Danh mục" links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Danh mục
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/catalog?category=phuong-tien" className="hover:text-primary-400 transition-colors">
                  Phương tiện di chuyển (Ô tô, Xe máy)
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=cong-nghe" className="hover:text-primary-400 transition-colors">
                  Thiết bị công nghệ & Máy ảnh
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=thoi-trang" className="hover:text-primary-400 transition-colors">
                  Thời trang dạ tiệc & Áo dài sự kiện
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=da-ngoai" className="hover:text-primary-400 transition-colors">
                  Dụng cụ dã ngoại & Camping Glamping
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-400 transition-colors">
                  Gói phong cách Lifestyle Bundles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: "Đối tác" links (Đăng ký, Quyền lợi, Hoa hồng) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Đối tác
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/partner" className="hover:text-primary-400 transition-colors font-medium text-emerald-400">
                  Đăng ký gian hàng đối tác &rarr;
                </Link>
              </li>
              <li>
                <Link to="/partner#benefits" className="hover:text-primary-400 transition-colors">
                  Quyền lợi nhà cung cấp M1 - M4
                </Link>
              </li>
              <li>
                <Link to="/partner#commission" className="hover:text-primary-400 transition-colors">
                  Chính sách phí sàn & Hoa hồng ưu đãi (từ 2%)
                </Link>
              </li>
              <li>
                <Link to="/partner#insurance" className="hover:text-primary-400 transition-colors">
                  Quy trình ký quỹ & Bảo hiểm thiết bị
                </Link>
              </li>
              <li>
                <Link to="/partner#b2b" className="hover:text-primary-400 transition-colors">
                  Giải pháp cho thuê Doanh nghiệp (B2B)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: "Hỗ trợ" links (Liên hệ, Điều khoản, Bảo hiểm) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Hỗ trợ
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Phone className="h-3.5 w-3.5 text-primary-400" />
                  <span>Tổng đài: <strong>1900 6868</strong> (24/7)</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Mail className="h-3.5 w-3.5 text-primary-400" />
                  <span>Email: support@renthub.vn</span>
                </span>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-400 transition-colors">
                  Điều khoản dịch vụ & Hợp đồng điện tử
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-400 transition-colors">
                  Chính sách bảo hiểm & Đền bù thất thoát
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-400 transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Border top gray-800. "© 2024 RentHub. All rights reserved." + Payment Method Icons */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2024 RentHub. All rights reserved. Nền tảng Kinh tế Tuần hoàn.</p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 mr-2">Phương thức thanh toán:</span>
            
            {/* MoMo Badge */}
            <div className="px-2.5 py-1 rounded-md bg-pink-950/60 border border-pink-700/50 text-pink-300 font-extrabold text-[10px] tracking-tight">
              MoMo
            </div>

            {/* VNPay Badge */}
            <div className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-700/50 text-blue-300 font-extrabold text-[10px] tracking-tight">
              VNPay QR
            </div>

            {/* Visa Badge */}
            <div className="px-2.5 py-1 rounded-md bg-gray-800 border border-gray-700 text-amber-300 font-black text-[10px] tracking-wider italic">
              VISA
            </div>

            {/* MasterCard Badge */}
            <div className="px-2.5 py-1 rounded-md bg-gray-800 border border-gray-700 text-orange-400 font-bold text-[10px]">
              MasterCard
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

