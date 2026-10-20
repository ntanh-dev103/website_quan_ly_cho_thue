import { useRef } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  FileCheck2, 
  Building2, 
  User 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import type { Contract } from '@/entities/contract/contract.types';
import { toast } from 'sonner';

interface ContractPdfModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContractPdfModal({ contract, isOpen, onClose }: ContractPdfModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !contract) return null;

  const handlePrint = () => {
    window.print();
    toast.success('Đang mở hộp thoại in / lưu PDF hợp đồng');
  };

  const formattedStartDate = new Date(contract.startDate).toLocaleDateString('vi-VN');
  const formattedEndDate = new Date(contract.endDate).toLocaleDateString('vi-VN');
  const formattedCreatedDate = new Date(contract.createdAt).toLocaleDateString('vi-VN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <FileCheck2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hợp Đồng Thuê Điện Tử Song Phương</h3>
              <p className="text-xs text-slate-400">
                Mã HĐ: <span className="text-primary-400 font-mono font-semibold">{contract.contractCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="gap-1.5 bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">In / Tải PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Paper Contract Content */}
        <div 
          ref={printRef}
          className="p-6 sm:p-10 overflow-y-auto space-y-6 text-gray-800 font-sans leading-relaxed text-xs sm:text-sm bg-white"
        >
          {/* Header Quốc hiệu */}
          <div className="text-center space-y-1 pb-4 border-b border-gray-200">
            <p className="font-bold uppercase tracking-widest text-xs text-gray-900">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </p>
            <p className="text-xs text-gray-600 font-medium italic underline decoration-1 underline-offset-4">
              Độc lập - Tự do - Hạnh phúc
            </p>
            <div className="pt-4">
              <h1 className="text-lg sm:text-xl font-extrabold uppercase text-gray-950 tracking-wide">
                HỢP ĐỒNG CHO THUÊ THIẾT BỊ ĐIỆN TỬ & BẢO LÃNH KÝ QUỸ
              </h1>
              <p className="text-xs text-gray-500 font-mono mt-1">
                Số: {contract.contractCode} • Ngày lập: {formattedCreatedDate}
              </p>
            </div>
          </div>

          {/* Căn cứ pháp lý */}
          <p className="text-[11px] text-gray-500 italic">
            - Căn cứ Bộ luật Dân sự số 91/2015/QH13 ngày 24/11/2015 và các văn bản hướng dẫn thi hành;<br />
            - Căn cứ Luật Giao dịch điện tử số 20/2023/QH15 và điều khoản hoạt động nền tảng RentNest Việt Nam;
          </p>

          {/* Các bên tham gia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            {/* Bên A */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase">
                <Building2 className="h-4 w-4 text-primary-600" />
                Bên Cho Thuê (Bên A)
              </div>
              <p className="text-xs"><span className="font-semibold text-gray-700">Đơn vị:</span> Hệ thống RentNest Partner Network</p>
              <p className="text-xs"><span className="font-semibold text-gray-700">Đại diện:</span> Trung tâm Điều phối Kho Thiết bị</p>
              <p className="text-xs"><span className="font-semibold text-gray-700">Hotline:</span> 1900 6868 (Hỗ trợ 24/7)</p>
            </div>

            {/* Bên B */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs uppercase">
                <User className="h-4 w-4 text-emerald-600" />
                Bên Thuê (Bên B)
              </div>
              <p className="text-xs"><span className="font-semibold text-gray-700">Khách hàng:</span> {contract.customer.name}</p>
              <p className="text-xs"><span className="font-semibold text-gray-700">Email:</span> {contract.customer.email}</p>
              <p className="text-xs"><span className="font-semibold text-gray-700">Địa chỉ giao:</span> {contract.deliveryAddress || 'Nhận trực tiếp tại hub RentNest'}</p>
            </div>
          </div>

          {/* Điều 1: Đối tượng hợp đồng */}
          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
              Điều 1: Đối tượng hợp đồng & Lịch trình thuê
            </h2>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-2.5">Thiết bị</th>
                    <th className="p-2.5">Thời hạn</th>
                    <th className="p-2.5">Số ngày</th>
                    <th className="p-2.5 text-right">Đơn giá/ngày</th>
                    <th className="p-2.5 text-right">Tổng tiền thuê</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-2.5 font-medium text-gray-900">
                      {contract.product.name}
                    </td>
                    <td className="p-2.5 text-gray-600">
                      {formattedStartDate} ➔ {formattedEndDate}
                    </td>
                    <td className="p-2.5 font-semibold text-gray-700">
                      {contract.totalDays} ngày
                    </td>
                    <td className="p-2.5 text-right text-gray-700">
                      {formatCurrency(contract.product.pricePerDay)}
                    </td>
                    <td className="p-2.5 text-right font-bold text-gray-900">
                      {formatCurrency(contract.rentalFee)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Điều 2: Tiền đặt cọc & Ký quỹ Escrow */}
          <div className="space-y-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
              Điều 2: Tiền đặt cọc & Cơ chế bảo chứng Escrow
            </h2>
            <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/80 space-y-1.5 text-xs text-amber-900">
              <div className="flex justify-between font-bold">
                <span>Số tiền đặt cọc thiết bị:</span>
                <span className="text-amber-800 text-sm">{formatCurrency(contract.depositAmount)}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                • Tiền cọc được khóa độc lập trong tài khoản bảo chứng (Escrow Safe).<br />
                • Sau khi Bên B trả thiết bị và Bên A xác nhận hoàn tất thẩm định không hư hỏng, số tiền cọc sẽ được hoàn trả 100% trong vòng 02 giờ làm việc.<br />
                • Trường hợp phát sinh hư hại do lỗi sử dụng, tiền phạt bồi thường sẽ được trừ trực tiếp từ tiền cọc theo biên bản giám định hiện trạng.
              </p>
            </div>
          </div>

          {/* Điều 3: Cam kết của các bên */}
          <div className="space-y-1.5 text-xs text-gray-600">
            <h2 className="text-xs sm:text-sm font-bold uppercase text-slate-900">
              Điều 3: Quyền và Nghĩa vụ song phương
            </h2>
            <p>1. Bên A bàn giao thiết bị đúng model, nguyên bản, kèm đầy đủ phụ kiện và pin sạc ổn định.</p>
            <p>2. Bên B có trách nhiệm bảo quản cẩn thận, không tự ý tháo dỡ linh kiện, không cho bên thứ ba thuê lại.</p>
            <p>3. Trong trường hợp trả trễ hạn không báo trước, Bên B chịu phí trễ 5%/ngày tính trên tổng tiền thuê.</p>
          </div>

          {/* Chữ ký số điện tử */}
          <div className="pt-6 border-t border-gray-200 grid grid-cols-2 text-center text-xs">
            <div>
              <p className="font-bold uppercase text-gray-800">Đại diện Bên A</p>
              <p className="text-[10px] text-gray-500 italic">(Ký điện tử & Đóng dấu)</p>
              <div className="my-3 inline-flex flex-col items-center justify-center p-2.5 rounded-lg border-2 border-red-500/80 bg-red-50/50 text-red-600 rotate-[-4deg] shadow-xs">
                <span className="font-extrabold text-[11px] tracking-wider uppercase">RENTNEST VIETNAM</span>
                <span className="text-[9px] font-bold">DIGITAL SIGNED & VERIFIED</span>
                <span className="text-[8px] font-mono text-red-500 mt-0.5">{new Date().toISOString().split('T')[0]}</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs">Phạm Minh Đức (Tổng Giám Đốc)</p>
            </div>

            <div>
              <p className="font-bold uppercase text-gray-800">Đại diện Bên B</p>
              <p className="text-[10px] text-gray-500 italic">(Đã đồng thuận qua OTP)</p>
              <div className="my-3 inline-flex flex-col items-center justify-center p-2.5 rounded-lg border-2 border-emerald-600/80 bg-emerald-50/50 text-emerald-700 rotate-[2deg] shadow-xs">
                <span className="font-extrabold text-[11px] tracking-wider uppercase">KHÁCH HÀNG XÁC THỰC</span>
                <span className="text-[9px] font-bold">SMART CONTRACT OK</span>
                <span className="text-[8px] font-mono text-emerald-600 mt-0.5">{formattedCreatedDate}</span>
              </div>
              <p className="font-semibold text-gray-900 text-xs">{contract.customer.name}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-t border-gray-200 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Hợp đồng có giá trị pháp lý theo Nghị định số 52/2013/NĐ-CP</span>
          </div>

          <Button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Đóng Hợp Đồng
          </Button>
        </div>

      </div>
    </div>
  );
}
