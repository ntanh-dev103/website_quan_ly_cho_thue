import { useState } from 'react';
import { UserPlus, Shield, X, Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { TeamMember } from '../account.types';
import { toast } from 'sonner';

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (member: Omit<TeamMember, 'id' | 'joinedDate' | 'status'>) => void;
}

export function TeamInviteModal({ isOpen, onClose, onInvite }: TeamInviteModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Staff' | 'Viewer'>('Staff');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onInvite({
        email,
        name: name || email.split('@')[0],
        role,
      });
      toast.success(`Đã gửi lời mời tới ${email}!`, {
        description: `Thành viên sẽ được cấp vai trò ${role} ngay khi xác nhận qua email.`,
      });
      onClose();
      setEmail('');
      setName('');
      setRole('Staff');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Mời thành viên vào Doanh nghiệp
              </h3>
              <p className="text-xs text-gray-500">
                Phân quyền truy cập RBAC cho tài khoản M4 Enterprise
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Họ và tên thành viên:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn Khoa"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Email công việc (*):
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="khoa.nguyen@enterprise.vn"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">
              Chọn vai trò phân quyền:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  key: 'Admin',
                  title: 'Admin (Quản trị viên)',
                  desc: 'Toàn quyền cấu hình, mời thành viên, xem API keys và ký duyệt hóa đơn',
                  color: 'border-purple-200 bg-purple-50/50',
                },
                {
                  key: 'Staff',
                  title: 'Staff (Nhân viên vận hành)',
                  desc: 'Tạo đơn cho thuê, bàn giao thiết bị, cập nhật trạng thái kho & E-Audit',
                  color: 'border-blue-200 bg-blue-50/50',
                },
                {
                  key: 'Viewer',
                  title: 'Viewer (Kế toán / Xem)',
                  desc: 'Chỉ xem báo cáo doanh thu, bảng kê giao dịch và xuất hóa đơn VAT',
                  color: 'border-gray-200 bg-gray-50/50',
                },
              ].map((r) => {
                const isSelected = role === r.key;
                return (
                  <div
                    key={r.key}
                    onClick={() => setRole(r.key as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-violet-600 ring-2 ring-violet-500/20 bg-violet-50/50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-gray-900">{r.title}</span>
                      <Shield className={`h-4 w-4 ${isSelected ? 'text-violet-600' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-[11px] text-gray-500">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold"
            >
              Gửi lời mời
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
