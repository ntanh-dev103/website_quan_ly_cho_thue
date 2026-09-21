import { useState, useMemo } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { MerchantApprovalTable } from '@/features/admin/merchants/MerchantApprovalTable';
import { useMerchantStore, type MerchantApplication } from '@/entities/user/useMerchantStore';
import { toast } from 'sonner';

const STATUS_TABS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
];

export function AdminApproval() {
  const { applications, approveApplication, rejectApplication } = useMerchantStore();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<MerchantApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const filteredApps = useMemo(() => {
    if (activeTab === 'ALL') return applications;
    return applications.filter(a => a.status === activeTab);
  }, [activeTab, applications]);

  const handleApprove = () => {
    if (selectedApp) {
      approveApplication(selectedApp.id);
      toast.success(`Đã duyệt thành công đối tác: ${selectedApp.companyName}`);
      setSelectedApp(null);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối!');
      return;
    }
    if (selectedApp) {
      rejectApplication(selectedApp.id, rejectReason);
      toast.error(`Đã từ chối đối tác: ${selectedApp.companyName}`);
      setSelectedApp(null);
      setIsRejecting(false);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyệt đối tác (Merchant)</h1>
          <p className="text-gray-500 mt-1">Kiểm tra thông tin pháp lý và cấp quyền Merchant</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-2 border-b border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent space-x-1 h-auto p-0">
              {STATUS_TABS.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-none rounded-md px-4 py-2"
                >
                  {tab.label}
                  {tab.value === 'PENDING' && (
                    <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {applications.filter(a => a.status === 'PENDING').length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <MerchantApprovalTable applications={filteredApps} onView={setSelectedApp} />
      </div>

      {/* Slide-in Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-lg text-gray-900">Chi tiết đối tác</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Công ty</label>
                <p className="font-bold text-gray-900 text-lg mt-1">{selectedApp.companyName}</p>
                <p className="text-sm text-gray-600 mt-1">MST: <span className="font-medium text-gray-900">{selectedApp.taxCode}</span></p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Người đại diện</label>
                <div className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="font-medium text-gray-900">{selectedApp.user.name}</p>
                  <p className="text-sm text-gray-600">{selectedApp.user.email}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Giấy phép kinh doanh</label>
                <a href={selectedApp.businessLicense} target="_blank" rel="noreferrer" className="block w-full aspect-video rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity">
                  <img src={selectedApp.businessLicense} alt="GPKD" className="w-full h-full object-cover" />
                </a>
                <p className="text-xs text-gray-400 mt-2 italic">* Click vào ảnh để xem kích thước đầy đủ</p>
              </div>

              {selectedApp.status === 'REJECTED' && selectedApp.rejectionReason && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <label className="text-xs font-bold text-red-600 uppercase mb-1 block">Lý do từ chối</label>
                  <p className="text-sm text-red-700">{selectedApp.rejectionReason}</p>
                </div>
              )}
            </div>

            {selectedApp.status === 'PENDING' && (
              <div className="p-6 border-t bg-gray-50">
                {isRejecting ? (
                  <div className="space-y-3 animate-fade-in">
                    <label className="text-sm font-medium text-gray-900">Nhập lý do từ chối</label>
                    <textarea 
                      className="w-full text-sm border-gray-300 rounded-lg p-3 min-h-[100px] focus:ring-primary-500 focus:border-primary-500"
                      placeholder="GPKD bị mờ, Sai thông tin MST..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setIsRejecting(false)}>Hủy</Button>
                      <Button variant="destructive" className="flex-1" onClick={handleReject}>Xác nhận từ chối</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setIsRejecting(true)}>
                      <XCircle className="w-4 h-4 mr-2" /> Từ chối
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Phê duyệt
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
