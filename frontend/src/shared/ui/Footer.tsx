import { Link } from 'react-router-dom';
import { 
  Compass, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  Lock, 
  Sparkles 
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/90 bg-white text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12">
        
        {/* TOP: Statement & Closing Vision (Ft5 Statement influence) */}
        <div className="pb-10 sm:pb-12 border-b border-gray-100 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Kinh tế tuần hoàn thông minh</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight">
              Tối ưu chi phí sở hữu.
              <span className="block text-primary-600 font-extrabold mt-0.5">
                Chia sẻ tài sản, đảm bảo hợp đồng.
              </span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/partner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all shadow-2xs hover:scale-[1.01]"
            >
              <span>Mở gian hàng cho thuê</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-semibold transition-all"
            >
              <span>Duyệt thiết bị có sẵn</span>
            </Link>
          </div>
        </div>

        {/* MIDDLE: 3 Refined Columns (Brand / Navigation / Merchant & Trust) */}
        <div className="py-10 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 border-b border-gray-100">
          
          {/* Col 1: Brand & Operational Trust (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <Compass className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-gray-950 leading-none">
                  RentHub
                </span>
                <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mt-0.5">
                  Rental Marketplace
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Nền tảng kết nối người có nhu cầu thuê thiết bị chuyên nghiệp với hệ thống đối tác xác minh danh tính. Áp dụng cơ chế xếp hạng tín nhiệm đa tầng để miễn giảm tiền cọc.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Xác thực CCCD & GPKD
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 border border-primary-200/60 text-primary-800 text-[11px] font-medium">
                <Lock className="h-3.5 w-3.5 text-primary-600" />
                Bảo hiểm tài sản 100%
              </span>
            </div>
          </div>

          {/* Col 2: Danh mục cho thuê (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">
              Danh mục thiết bị
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <Link to="/catalog?category=may-anh" className="hover:text-primary-600 transition-colors">
                  Máy ảnh & Flycam 4K
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=o-to" className="hover:text-primary-600 transition-colors">
                  Ô tô điện & Xe tự lái
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=laptop" className="hover:text-primary-600 transition-colors">
                  Laptop Workstation & PC
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=da-ngoai" className="hover:text-primary-600 transition-colors">
                  Lều cắm trại & Dã ngoại Glamping
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=thoi-trang" className="hover:text-primary-600 transition-colors">
                  Trang phục dạ tiệc & Thảm đỏ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Đối tác & Pháp lý (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950">
              Đối tác & Quy chế sàn
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-500">
              <li>
                <Link to="/partner" className="hover:text-primary-600 transition-colors font-medium text-primary-600 inline-flex items-center gap-1">
                  <span>Chính sách đối tác M1–M4 (Hoa hồng từ 2%)</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-600 transition-colors">
                  Cơ chế miễn cọc theo Customer Tier (C1–C4)
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-600 transition-colors">
                  Quy trình lập biên bản sự cố hư hại thiết bị
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-600 transition-colors">
                  Điều khoản sử dụng & Hợp đồng điện tử
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary-600 transition-colors">
                  Chính sách bảo mật thông tin định danh
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM: Contact info, Copyright & Payment Methods */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-gray-500">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <span>© {currentYear} RentHub Marketplace. Bản quyền thuộc về Đồ Án Tốt Nghiệp.</span>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary-600" />
                <span className="font-semibold text-gray-900">1900 6868</span>
                <span className="text-gray-400">(24/7)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary-600" />
                <span>support@renthub.vn</span>
              </span>
            </div>
          </div>

          {/* Payment Partners (Clean minimal badges) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] text-gray-400 mr-1">Thanh toán an toàn:</span>
            <span className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-700">
              MoMo
            </span>
            <span className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-700">
              VNPay QR
            </span>
            <span className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-700">
              Visa / Master
            </span>
            <span className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] font-semibold text-gray-700">
              Chuyển khoản
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
