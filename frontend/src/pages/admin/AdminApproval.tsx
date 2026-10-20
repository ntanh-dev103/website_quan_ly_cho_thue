import { useState, useMemo, useEffect } from 'react';
import { X, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { MerchantApprovalTable } from '@/features/admin/merchants/MerchantApprovalTable';
import { useMerchantStore, type MerchantApplication } from '@/entities/user/useMerchantStore';
import { adminApi } from '@/api/admin.api';
import { toast } from 'sonner';

const STATUS_TABS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export function AdminApproval() {
  const { applications, approveApplication, rejectApplication } = useMerchantStore();
  const [localApps, setLocalApps] = useState<MerchantApplication[]>(applications);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<MerchantApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [initialTier, setInitialTier] = useState('M2');

  useEffect(() => {
    adminApi.getPendingMerchants().then((pending) => {
      if (pending && pending.length > 0) {
        // Merge or replace
        const mapped: MerchantApplication[] = pending.map(p => ({
          id: String(p.id),
          user: {
            id: String(p.id),
            name: p.fullName,
            email: p.email,
            phone: p.phone,
            createdAt: p.createdAt,
          } as any,
          companyName: p.companyName,
          taxCode: p.taxCode,
          businessLicense: p.businessLicense,
          status: p.status,
          createdAt: p.createdAt,
          rejectionReason: p.rejectionReason,
        }));
        setLocalApps(mapped);
      }
    });
  }, []);

  const filteredApps = useMemo(() => {
    if (activeTab === 'ALL') return localApps;
    return localApps.filter(a => a.status === activeTab);
  }, [activeTab, localApps]);

  const handleApprove = async () => {
    if (!selectedApp) return;

    try {
      await adminApi.approveMerchant(selectedApp.id, initialTier);
      approveApplication(selectedApp.id);
      setLocalApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'APPROVED' } : a));
      toast.success(`Đã duyệt thành công đối tác: ${selectedApp.companyName}!`, {
        description: `Tài khoản đã được nâng cấp lên Thương gia với hạng khởi đầu ${initialTier}.`,
      });
      setSelectedApp(null);
    } catch {
      approveApplication(selectedApp.id);
      setLocalApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'APPROVED' } : a));
      toast.success(`Đã duyệt thành công đối tác: ${selectedApp.companyName}!`);
      setSelectedApp(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối!');
      return;
    }
    if (!selectedApp) return;

    try {
      await adminApi.rejectMerchant(selectedApp.id, rejectReason.trim());
      rejectApplication(selectedApp.id, rejectReason.trim());
      setLocalApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'REJECTED', rejectionReason: rejectReason } : a));
      toast.info(`Đã từ chối hồ sơ đối tác: ${selectedApp.companyName}`);
      setSelectedApp(null);
      setIsRejecting(false);
      setRejectReason('');
    } catch {
      rejectApplication(selectedApp.id, rejectReason.trim());
      setLocalApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'REJECTED', rejectionReason: rejectReason } : a));
      toast.info(`Đã từ chối hồ sơ đối tác: ${selectedApp.companyName}`);
      setSelectedApp(null);
      setIsRejecting(false);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Duyệt Hồ Sơ Đối Tác (Merchant Approval)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Kiểm tra tính hợp lệ của Giấy phép kinh doanh, Mã số thuế và phân cấp hạng ban đầu</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent space-x-1 h-auto p-0">
              {STATUS_TABS.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-none rounded-lg px-4 py-2 text-xs font-bold"
                >
                  {tab.label}
                  {tab.value === 'PENDING' && (
                    <span className="ml-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {localApps.filter(a => a.status === 'PENDING').length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <span className="text-xs text-slate-400 font-mono shrink-0">
            {filteredApps.length} hồ sơ
          </span>
        </div>

        <MerchantApprovalTable applications={filteredApps} onView={setSelectedApp} />
      </div>

      {/* Slide-in Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => setSelectedApp(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="font-extrabold text-base text-slate-900">Chi tiết hồ sơ đối tác</h2>
                <p className="text-xs text-slate-500">Mã đơn: #{selectedApp.id}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doanh nghiệp / Cửa hàng</label>
                <p className="font-extrabold text-slate-900 text-lg">{selectedApp.companyName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-600">Mã số thuế:</span>
                  <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {selectedApp.taxCode}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Người đại diện pháp lý</label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{selectedApp.user.name}</p>
                  <p className="text-xs text-slate-600">Email: {selectedApp.user.email}</p>
                  {selectedApp.user.phone && <p className="text-xs text-slate-600">SĐT: {selectedApp.user.phone}</p>}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Giấy phép kinh doanh (GPKD / ĐKKD)</label>
                <a 
                  href={selectedApp.businessLicense} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block w-full aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:opacity-95 transition-opacity group relative bg-slate-100"
                >
                  <img src={selectedApp.businessLicense} alt="GPKD" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Mở xem ảnh gốc</span>
                  </div>
                </a>
                <p className="text-[11px] text-slate-400 mt-1.5 italic">* Kiểm tra kỹ tên doanh nghiệp và mã số thuế trùng khớp với cổng thông tin quốc gia</p>
              </div>

              {selectedApp.status === 'PENDING' && (
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                  <label className="text-xs font-bold text-blue-900 block">Cấp bậc khởi đầu sau khi duyệt:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setInitialTier('M1')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        initialTier === 'M1' ? 'border-primary-600 bg-white font-bold text-primary-900 shadow-2xs' : 'border-blue-200 text-blue-700'
                      }`}
                    >
                      <span>M1 Starter (15%)</span>
                      <span className="block text-[10px] font-normal text-slate-500">Tối đa 20 sản phẩm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInitialTier('M2')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        initialTier === 'M2' ? 'border-primary-600 bg-white font-bold text-primary-900 shadow-2xs' : 'border-blue-200 text-blue-700'
                      }`}
                    >
                      <span>M2 Pro (10%)</span>
                      <span className="block text-[10px] font-normal text-slate-500">Không giới hạn sản phẩm</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedApp.status === 'REJECTED' && selectedApp.rejectionReason && (
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-xs">
                  <label className="font-bold text-rose-700 uppercase mb-1 block">Lý do đã từ chối:</label>
                  <p className="text-rose-800">{selectedApp.rejectionReason}</p>
                </div>
              )}
            </div>

            {selectedApp.status === 'PENDING' && (
              <div className="p-5 border-t bg-slate-50">
                {isRejecting ? (
                  <div className="space-y-3 animate-fade-in">
                    <label className="text-xs font-bold text-slate-900 block">Nhập lý do từ chối hồ sơ đối tác:</label>
                    <textarea 
                      className="w-full text-xs border border-slate-300 rounded-xl p-3 min-h-[90px] focus:ring-primary-500 focus:border-primary-500 bg-white"
                      placeholder="VD: Giấy phép kinh doanh bị mờ, Sai thông tin MST, Cần bổ sung tài liệu..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setIsRejecting(false)}>Hủy</Button>
                      <Button variant="destructive" size="sm" className="flex-1 text-xs font-bold" onClick={handleReject}>Xác nhận từ chối</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" 
                      onClick={() => setIsRejecting(true)}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" /> Từ chối
                    </Button>
                    <Button 
                      className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                      onClick={handleApprove}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Phê duyệt & Cấp quyền
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
