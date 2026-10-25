import { useState, useEffect } from 'react';
import { 
  Settings, 
  Zap, 
  ShieldAlert, 
  Store, 
  User as UserIcon, 
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { toast } from 'sonner';

export function DemoWidget() {
  const { role, tier, user, login, logout, getDepositRate, getCommissionRate } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Add event listener for Escape key to close the widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = async (newRole: any, newTier: any) => {
    setIsSwitching(true);
    try {
      if (newRole === 'GUEST') {
        logout();
        toast.info('Đã chuyển sang chế độ Khách vãng lai (Guest)');
        return;
      }

      let email = 'customer@demo.com';
      let title = 'Khách C1';
      if (newRole === 'ADMIN') {
        email = 'admin@demo.com';
        title = 'Admin Hệ Thống';
      } else if (newTier === 'M1') {
        email = 'merchant1@demo.com';
        title = 'Đối tác M1 (Starter)';
      } else if (newTier === 'M2') {
        email = 'merchant@demo.com';
        title = 'Đối tác M2 (Pro)';
      } else if (newTier === 'M3') {
        email = 'merchant3@demo.com';
        title = 'Đối tác M3 (Master)';
      } else if (newTier === 'M4') {
        email = 'merchant4@demo.com';
        title = 'Đối tác M4 (Enterprise)';
      } else if (newTier === 'C2') {
        email = 'silver@demo.com';
        title = 'Khách C2 (Đã KYC)';
      } else if (newTier === 'C3') {
        email = 'gold@demo.com';
        title = 'Khách C3 (VIP Gold)';
      } else if (newTier === 'C4') {
        email = 'vip@demo.com';
        title = 'Khách C4 (VIP Kim Cương - 0% cọc)';
      }

      await login(email, '123456');
      toast.success(`Đã đăng nhập: ${title}`, {
        description: `Tài khoản: ${email}`,
      });
    } catch (err: any) {
      toast.error('Lỗi khi chuyển tài khoản: ' + (err?.message || 'Không thể đăng nhập'));
    } finally {
      setIsSwitching(false);
    }
  };

  const depositRate = getDepositRate() * 100;
  const commissionRate = getCommissionRate() * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white/95 backdrop-blur-2xl border border-gray-200/90 shadow-2xl rounded-2xl p-5 w-88 animate-in slide-in-from-bottom-5 text-gray-900 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg text-white shadow-sm">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-sm">Demo Controller</h3>
                <p className="text-[10px] text-gray-500 font-medium">Chuyển vai trò & kiểm thử UI thực tế</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-xs px-1.5 py-0.5 rounded-md hover:bg-gray-100 font-bold"
            >
              ✕
            </button>
          </div>

          {/* Current Active Account Status */}
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200/70 mb-3 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span className="truncate max-w-[170px]">{user?.name || 'Khách vãng lai'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                role === 'MERCHANT' ? 'bg-purple-100 text-purple-700' :
                role === 'CUSTOMER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {role} • {tier}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span className="truncate max-w-[160px]">{user?.email || 'Chưa đăng nhập'}</span>
              {role === 'CUSTOMER' && (
                <span className="text-emerald-600 font-bold">Ký quỹ: {depositRate}%</span>
              )}
              {role === 'MERCHANT' && (
                <span className="text-purple-600 font-bold">Chiết khấu: {commissionRate}%</span>
              )}
            </div>
          </div>
          
          <div className="space-y-3.5">
            {/* Customer Tiers */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Khách Thuê (Customer)</label>
                <span className="text-[10px] text-gray-400 font-medium">Giảm dần tiền cọc</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'C1', label: 'C1', sub: '40% cọc' },
                  { key: 'C2', label: 'C2', sub: '30% cọc' },
                  { key: 'C3', label: 'C3', sub: '15% cọc' },
                  { key: 'C4', label: 'C4', sub: '0% cọc' },
                ].map(t => (
                  <button
                    key={t.key}
                    disabled={isSwitching}
                    onClick={() => handleRoleChange('CUSTOMER', t.key)}
                    className={`flex flex-col items-center py-1.5 px-1 rounded-lg border text-center transition-all ${
                      role === 'CUSTOMER' && tier === t.key 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold ring-2 ring-blue-500/20' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <span className="text-xs font-black">{t.label}</span>
                    <span className={`text-[9px] ${role === 'CUSTOMER' && tier === t.key ? 'text-blue-100' : 'text-gray-400'}`}>
                      {t.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Merchant Tiers */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Đối Tác (Merchant)</label>
                <span className="text-[10px] text-gray-400 font-medium">Hạ dần phí hoa hồng</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { key: 'M1', label: 'M1', sub: '15% phí' },
                  { key: 'M2', label: 'M2', sub: '10% phí' },
                  { key: 'M3', label: 'M3', sub: '5% phí' },
                  { key: 'M4', label: 'M4', sub: '2% B2B' },
                ].map(t => (
                  <button
                    key={t.key}
                    disabled={isSwitching}
                    onClick={() => handleRoleChange('MERCHANT', t.key)}
                    className={`flex flex-col items-center py-1.5 px-1 rounded-lg border text-center transition-all ${
                      role === 'MERCHANT' && tier === t.key 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-bold ring-2 ring-purple-500/20' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                    }`}
                  >
                    <span className="text-xs font-black">{t.label}</span>
                    <span className={`text-[9px] ${role === 'MERCHANT' && tier === t.key ? 'text-purple-100' : 'text-gray-400'}`}>
                      {t.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Role & Special */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <button
                disabled={isSwitching}
                onClick={() => {
                  useAuthStore.getState().setRoleAndTier('CUSTOMER', 'C3', ['CUSTOMER', 'MERCHANT'], 'C3', 'M2');
                  toast.success('Đã kích hoạt chế độ Hội viên Tuần hoàn Kép: C3 VIP + M2 Pro!');
                }}
                className="w-full text-xs font-bold py-2 rounded-lg border border-emerald-300 bg-gradient-to-r from-emerald-50 to-primary-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-all shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>🔄 Kép Dual: C3 VIP + M2 Pro</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={isSwitching}
                  onClick={() => handleRoleChange('GUEST', 'G1')}
                  className={`text-xs font-bold py-2 rounded-lg border transition-all flex items-center justify-center gap-1 ${
                    role === 'GUEST'
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Guest</span>
                </button>
                <button
                  disabled={isSwitching}
                  onClick={() => handleRoleChange('ADMIN', 'A1')}
                  className={`text-xs font-bold py-2 rounded-lg border transition-all flex items-center justify-center gap-1 ${
                    role === 'ADMIN'
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                      : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Direct Navigation Links */}
              <div className="pt-2 grid grid-cols-3 gap-1.5 text-center text-[11px] font-bold">
                <a
                  href="/account"
                  className="py-1.5 px-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200/80 flex items-center justify-center gap-1"
                >
                  <UserIcon className="w-3 h-3" />
                  <span>/account</span>
                </a>
                <a
                  href="/merchant"
                  className="py-1.5 px-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200/80 flex items-center justify-center gap-1"
                >
                  <Store className="w-3 h-3" />
                  <span>/merchant</span>
                </a>
                <a
                  href="/admin"
                  className="py-1.5 px-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200/80 flex items-center justify-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>/admin</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all ring-4 ring-white/80"
        title="Bật/tắt Demo Controller"
      >
        <Settings className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}
