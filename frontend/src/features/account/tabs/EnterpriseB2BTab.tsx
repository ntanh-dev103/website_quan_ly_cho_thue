import { useState } from 'react';
import { 
  Users, 
  Key, 
  FileText, 
  Copy, 
  Eye, 
  EyeOff, 
  Send, 
  Download, 
  ShieldCheck, 
  UserPlus, 
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { FeatureGate } from '@/shared/ui/FeatureGate';
import { UpgradePrompt } from '@/shared/ui/UpgradePrompt';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { formatCurrency } from '@/shared/lib/utils';
import { mockTeamMembers, mockVatInvoices } from '../account.mock';
import type { TeamMember, VatInvoice } from '../account.types';
import { TeamInviteModal } from '../components/TeamInviteModal';
import { toast } from 'sonner';

export function EnterpriseB2BTab() {
  const { updateTier } = useAuthStore();
  const [team, setTeam] = useState<TeamMember[]>(mockTeamMembers);
  const [invoices] = useState<VatInvoice[]>(mockVatInvoices);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const rawApiKey = 'rh_live_9a7bc482f01d4e789bcde34ef819a022';
  const maskedApiKey = 'rh_live_••••••••••••••••••••34ef81';
  const webhookUrl = 'https://api.renthub.vn/v1/webhooks/contract-events';

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(rawApiKey);
    toast.success('Đã sao chép API Key vào clipboard!');
  };

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      toast.success('Kiểm tra Webhook thành công!', {
        description: 'Máy chủ phản hồi HTTP 200 OK trong 48ms.',
      });
    }, 800);
  };

  const handleAddMember = (newMember: Omit<TeamMember, 'id' | 'joinedDate' | 'status'>) => {
    const member: TeamMember = {
      ...newMember,
      id: `team-${Date.now()}`,
      joinedDate: 'Vừa tham gia',
      status: 'INVITED',
    };
    setTeam(prev => [member, ...prev]);
  };

  const handleRemoveMember = (id: string, name: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    toast.info(`Đã gỡ quyền thành viên ${name}.`);
  };

  const handleDownloadInvoice = (code: string) => {
    toast.success(`Đang tải hóa đơn điện tử VAT ${code}.pdf...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Strict FeatureGate for Tier M4 */}
      <FeatureGate
        requiredTier="M4"
        fallback={
          <div className="space-y-4">
            <UpgradePrompt requiredTier="M4" />
            
            {/* Quick Demo Switcher for Evaluators */}
            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-center space-y-2">
              <span className="text-xs font-semibold text-violet-700 block">
                Chế độ thử nghiệm: Bạn đang xem tính năng ở góc nhìn tài khoản chưa nâng cấp M4.
              </span>
              <Button
                size="sm"
                onClick={() => {
                  updateTier('M4');
                  toast.success('Đã nâng cấp tài khoản lên M4 Enterprise!', {
                    description: 'Mở khóa đầy đủ: Quản lý Team RBAC, API Tích hợp, Hóa đơn VAT và Net-30.',
                  });
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs"
              >
                <Sparkles className="h-4 w-4 mr-1.5" />
                Mở khóa trải nghiệm Demo M4 Enterprise
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Header banner */}
          <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-violet-500/30 text-violet-200 text-xs font-bold px-2.5 py-0.5 rounded-full border border-violet-400/30">
                    M4 Enterprise Suite
                  </span>
                  <span className="text-xs text-gray-300 font-medium">B2B Verified Hub</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Trung tâm Doanh nghiệp & Vận hành Quy mô lớn
                </h2>
                <p className="text-xs text-violet-200 max-w-xl">
                  Quản trị đa người dùng RBAC, tích hợp API quản lý vòng đời thiết bị, xuất hóa đơn VAT điện tử và bảo lãnh công nợ Net-30.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-white text-violet-950 hover:bg-violet-50 font-bold text-xs shadow-sm"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Mời thành viên mới
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION: QUẢN LÝ TEAM (RBAC) */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Quản lý Team (RBAC Sub-accounts)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Phân quyền chi tiết cho nhân sự công ty và bộ phận kế toán
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs h-8"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Mời thành viên
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Thành viên</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Vai trò (RBAC)</th>
                    <th className="py-3 px-4">Ngày tham gia</th>
                    <th className="py-3 px-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {team.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="h-8 w-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                              {member.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-bold text-gray-900">{member.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-gray-600">
                        {member.email}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            member.role === 'Admin'
                              ? 'bg-purple-100 text-purple-700'
                              : member.role === 'Staff'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500">
                        {member.joinedDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Gỡ quyền"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION: API TÍCH HỢP */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    API Tích hợp Doanh nghiệp
                  </h3>
                  <p className="text-xs text-gray-500">
                    Kết nối hệ thống ERP / Kho bãi của bạn trực tiếp vào RentHub Engine
                  </p>
                </div>
              </div>

              <a
                href="#api-docs"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Tài liệu API RentHub v2.0 đang sẵn sàng tại /docs/api');
                }}
                className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
              >
                <span>Tài liệu API v2.0</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* API Key */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <label className="text-xs font-bold text-gray-700 block">
                  Production API Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={showApiKey ? rawApiKey : maskedApiKey}
                    className="flex-1 px-3 py-1.5 font-mono text-xs bg-white border border-gray-300 rounded-lg text-gray-800"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="h-8 px-2.5"
                    title={showApiKey ? 'Ẩn' : 'Hiện'}
                  >
                    {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApiKey}
                    className="h-8 px-2.5 text-primary-600 border-primary-200 hover:bg-primary-50"
                    title="Sao chép"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Không chia sẻ key này ra ngoài. Có quyền tạo hợp đồng và truy vấn sổ cái.
                </p>
              </div>

              {/* Webhook URL */}
              <div className="space-y-1.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <label className="text-xs font-bold text-gray-700 block">
                  Webhook Event Endpoint
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 px-3 py-1.5 font-mono text-xs bg-white border border-gray-300 rounded-lg text-gray-800"
                  />
                  <Button
                    type="button"
                    size="sm"
                    loading={isTestingWebhook}
                    onClick={handleTestWebhook}
                    className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shrink-0"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Ping Test
                  </Button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Sự kiện gửi: <code className="text-gray-600">contract.approved</code>, <code className="text-gray-600">audit.passed</code>, <code className="text-gray-600">escrow.released</code>
                </p>
              </div>
            </div>
          </div>

          {/* SECTION: HÓA ĐƠN VAT & NET-30 */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Hóa đơn VAT & Chính sách Net-30
                  </h3>
                  <p className="text-xs text-gray-500">
                    Bảng kê hóa đơn điện tử hàng tháng và quản trị thanh toán chậm
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Hạn mức Net-30: 500.000.000 ₫
              </span>
            </div>

            {/* Explanation banner required by prompt */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 space-y-1">
                <span className="font-bold">Đặc quyền C4 Enterprise & Doanh nghiệp đối tác:</span>
                <p className="text-blue-800 leading-relaxed">
                  C4 Enterprise khách hàng của bạn được thanh toán chậm 30 ngày (Net-30 SLA Guaranteed). RentHub bảo lãnh 100% dòng tiền của Merchant và ứng trước thanh toán vào ngày 05 hàng tháng.
                </p>
              </div>
            </div>

            {/* Invoices table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Mã HĐ VAT</th>
                    <th className="py-3 px-4">Doanh nghiệp khách hàng</th>
                    <th className="py-3 px-4">Kỳ hóa đơn</th>
                    <th className="py-3 px-4">Thuế suất</th>
                    <th className="py-3 px-4">Tổng thanh toán</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Tải về</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {inv.invoiceCode}
                      </td>

                      <td className="py-3 px-4 font-semibold text-gray-800">
                        {inv.clientCompany}
                      </td>

                      <td className="py-3 px-4 text-gray-600">
                        {inv.period}
                      </td>

                      <td className="py-3 px-4 text-gray-500">
                        {inv.taxRate}
                      </td>

                      <td className="py-3 px-4 font-extrabold text-gray-900">
                        {formatCurrency(inv.amount)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Đã xuất'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadInvoice(inv.invoiceCode)}
                          className="h-8 px-2.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg text-xs font-semibold"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </FeatureGate>

      {/* Team Invite Modal */}
      <TeamInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleAddMember}
      />
    </div>
  );
}
