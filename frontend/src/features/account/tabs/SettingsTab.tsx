import { useState } from 'react';
import { Settings, Bell, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function SettingsTab() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [contractAlert, setContractAlert] = useState(true);
  const [circularProposals, setCircularProposals] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Đã lưu cấu hình cài đặt tài khoản!');
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          Cài đặt Tài khoản & Tùy biến Hệ thống
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Quản lý thông báo, chính sách chia sẻ kinh tế tuần hoàn và bảo mật nâng cao
        </p>
      </div>

      {/* Circular Sharing Settings */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Cơ chế Tuần hoàn & Chuyển tiếp (Circular Economy Sharing)
            </h4>
            <p className="text-xs text-gray-500">
              Tối ưu hóa tài nguyên và chi phí sử dụng đồ công nghệ
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Cho phép nhận đề xuất "Chuyển đồ thuê" (Circular Pass-forward)
              </p>
              <p className="text-[11px] text-gray-500">
                Khi bạn có những ngày trống không dùng thiết bị, hệ thống tự động kết nối khách hàng có nhu cầu ngắn ngày.
              </p>
            </div>
            <input
              type="checkbox"
              checked={circularProposals}
              onChange={(e) => setCircularProposals(e.target.checked)}
              className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Tự động gia hạn hợp đồng thuê (Auto-Renew)
              </p>
              <p className="text-[11px] text-gray-500">
                Tự động trừ tiền thuê theo ngày nếu đến hạn mà chưa gửi yêu cầu trả hàng, tránh rơi vào trạng thái Quá hạn (OVERDUE).
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked={true}
              className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Cài đặt Thông báo & Nhắc hạn
            </h4>
            <p className="text-xs text-gray-500">
              Nhận thông báo nhắc hạn trả hàng và xác nhận cọc Escrow
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Thông báo nhắc hạn trả thiết bị (Trước 24h & 4h)
              </p>
              <p className="text-[11px] text-gray-500">
                Gửi qua SMS và Notification trên ứng dụng
              </p>
            </div>
            <input
              type="checkbox"
              checked={contractAlert}
              onChange={(e) => setContractAlert(e.target.checked)}
              className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Email thông báo biến động số dư và giải tỏa cọc Escrow
              </p>
              <p className="text-[11px] text-gray-500">
                Gửi sao kê điện tử có chữ ký số xác thực
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={(e) => setEmailNotif(e.target.checked)}
              className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Bảo mật & Xác thực hai bước (2FA)
            </h4>
            <p className="text-xs text-gray-500">
              Bảo vệ ví tiền và tài sản ký quỹ Escrow của bạn
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Xác thực 2 yếu tố khi Rút tiền (2FA OTP)
              </p>
              <p className="text-[11px] text-gray-500">
                Bắt buộc nhập mã OTP gửi về số điện thoại đăng ký mỗi lần tạo lệnh rút tiền
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactorAuth(!twoFactorAuth);
                toast.success(twoFactorAuth ? 'Đã tắt 2FA' : 'Đã kích hoạt 2FA thành công!');
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                twoFactorAuth
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {twoFactorAuth ? 'Đang bật 2FA' : 'Kích hoạt ngay'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          loading={isSaving}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6"
        >
          Lưu tất cả cài đặt
        </Button>
      </div>
    </div>
  );
}
