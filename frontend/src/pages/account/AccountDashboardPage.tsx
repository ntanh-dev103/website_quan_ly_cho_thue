import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Store, 
  Building2, 
  Wallet, 
  UserCog, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { TierBadge } from '@/shared/ui/TierBadge';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { OverviewTab } from '@/features/account/tabs/OverviewTab';
import { RentingInTab } from '@/features/account/tabs/RentingInTab';
import { RentingOutTab } from '@/features/account/tabs/RentingOutTab';
import { EnterpriseB2BTab } from '@/features/account/tabs/EnterpriseB2BTab';
import { ProfileAndTiersTab } from '@/features/account/tabs/ProfileAndTiersTab';
import { WalletLedgerTab } from '@/features/account/tabs/WalletLedgerTab';
import { SettingsTab } from '@/features/account/tabs/SettingsTab';
import { CircularRelistModal } from '@/features/account/components/CircularRelistModal';
import { toast } from 'sonner';

export type TabKey = 
  | 'overview' 
  | 'renting-in' 
  | 'renting-out' 
  | 'b2b-enterprise' 
  | 'wallet' 
  | 'profile' 
  | 'settings';

export function AccountDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { 
    user, 
    role, 
    tier, 
    customerTier, 
    merchantTier, 
    hasRole, 
    logout, 
    setRoleAndTier 
  } = useAuthStore();

  const activeCTier = tier.startsWith('C') ? tier : customerTier;
  const activeMTier = tier.startsWith('M') ? tier : merchantTier;

  const tabParam = (searchParams.get('tab') as TabKey) || 'overview';
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isRelistModalOpen, setIsRelistModalOpen] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (tab: string) => {
    const validTab = tab as TabKey;
    setActiveTab(validTab);
    setSearchParams({ tab: validTab });
    setIsMobileSidebarOpen(false);
  };


  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công!');
    navigate('/login');
  };

  // Visibility checks based on role
  const isCustomer = hasRole('CUSTOMER');
  const isMerchant = hasRole('MERCHANT');
  const isM4 = tier === 'M4' || merchantTier === 'M4';
  const isDualRole = isCustomer && isMerchant;

  // Preset Persona Switcher for Evaluation
  const handleSwitchPersona = (type: 'C1' | 'C2' | 'M1' | 'M2' | 'M4' | 'DUAL') => {
    switch (type) {
      case 'C1':
        setRoleAndTier('CUSTOMER', 'C1', ['CUSTOMER'], 'C1', 'M1');
        toast.info('Đã chuyển sang: Khách hàng mới (C1 Newbie - Pure Customer)', {
          description: 'Tab "Cho thuê RA" và "B2B" đã ẩn khỏi sidebar.',
        });
        if (activeTab === 'renting-out' || activeTab === 'b2b-enterprise') handleSelectTab('overview');
        break;
      case 'C2':
        setRoleAndTier('CUSTOMER', 'C2', ['CUSTOMER'], 'C2', 'M1');
        toast.info('Đã chuyển sang: Khách hàng đã KYC (C2 Verified - Pure Customer)', {
          description: 'Hưởng mức ký quỹ 30%, tab "Cho thuê RA" ẩn khỏi sidebar.',
        });
        if (activeTab === 'renting-out' || activeTab === 'b2b-enterprise') handleSelectTab('overview');
        break;
      case 'M1':
        setRoleAndTier('MERCHANT', 'M1', ['MERCHANT'], 'C1', 'M1');
        toast.info('Đã chuyển sang: Đối tác Starter (M1 - Pure Merchant)', {
          description: 'Tab "Đang thuê VÀO" đã ẩn. Có cảnh báo giới hạn 20 sản phẩm.',
        });
        if (activeTab === 'renting-in') handleSelectTab('overview');
        break;
      case 'M2':
        setRoleAndTier('MERCHANT', 'M2', ['MERCHANT'], 'C1', 'M2');
        toast.info('Đã chuyển sang: Đối tác Pro (M2 - Pure Merchant)', {
          description: 'Mở khóa tính năng duyệt tự động Auto-Approve và kho vô hạn.',
        });
        if (activeTab === 'renting-in') handleSelectTab('overview');
        break;
      case 'M4':
        setRoleAndTier('MERCHANT', 'M4', ['MERCHANT'], 'C1', 'M4');
        toast.info('Đã chuyển sang: Doanh nghiệp M4 Enterprise', {
          description: 'Mở khóa hoàn toàn tab "VB2B Doanh nghiệp" với RBAC & API.',
        });
        if (activeTab === 'renting-in') handleSelectTab('overview');
        break;
      case 'DUAL':
        setRoleAndTier('CUSTOMER', 'C3', ['CUSTOMER', 'MERCHANT'], 'C3', 'M2');
        toast.success('Đã chuyển sang: Hội viên Tuần hoàn Kép (Dual Role: C3 VIP + M2 Pro)', {
          description: 'Tất cả các liên kết sidebar đều hiển thị. Nền kinh tế tuần hoàn hợp nhất!',
        });
        break;
    }
  };

  // Nav items configuration
  const navItems = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      visible: true,
    },
    {
      id: 'renting-in',
      label: 'Đang thuê VÀO',
      icon: ShoppingCart,
      visible: isCustomer,
      badge: '3 đang chạy',
    },
    {
      id: 'renting-out',
      label: 'Cho thuê RA',
      icon: Store,
      visible: isMerchant,
      badge: '3 đơn mới',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'b2b-enterprise',
      label: 'VB2B Doanh nghiệp',
      icon: Building2,
      visible: isMerchant, // Visible for merchant; tab content is strictly gated by FeatureGate M4
      badge: isM4 ? 'M4 Pro' : 'M4 Lock',
      badgeColor: isM4 ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500',
    },
    {
      id: 'wallet',
      label: 'Ví & Tài chính',
      icon: Wallet,
      visible: true,
    },
    {
      id: 'profile',
      label: 'Hồ sơ & Cấp bậc',
      icon: UserCog,
      visible: true,
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      visible: true,
    },
  ];

  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      
      {/* EVALUATION & DEMO PERSONA SWITCHER BAR */}
      <div className="bg-gradient-to-r from-gray-900 via-primary-950 to-gray-900 text-white px-4 py-2 text-xs border-b border-gray-800 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-gray-200">Kịch bản thử nghiệm Role & Tier:</span>
            <span className="text-gray-400 hidden sm:inline">• Nhấn để kiểm tra các điều kiện hiển thị:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleSwitchPersona('C1')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                !isMerchant && activeCTier === 'C1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Khách C1 (Mới)
            </button>

            <button
              onClick={() => handleSwitchPersona('C2')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                !isMerchant && activeCTier === 'C2'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Khách C2 (KYC)
            </button>

            <button
              onClick={() => handleSwitchPersona('M1')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                !isCustomer && activeMTier === 'M1'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Đối tác M1 (Kho &lt; 20)
            </button>

            <button
              onClick={() => handleSwitchPersona('M2')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                !isCustomer && activeMTier === 'M2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Đối tác M2 Pro
            </button>

            <button
              onClick={() => handleSwitchPersona('M4')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                activeMTier === 'M4'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              M4 Enterprise (B2B)
            </button>

            <button
              onClick={() => handleSwitchPersona('DUAL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                isDualRole
                  ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white shadow-xs ring-1 ring-white/30'
                  : 'bg-gray-800 text-emerald-400 hover:bg-gray-700'
              }`}
            >
              <RefreshCw className="h-3 w-3" />
              <span>Kép (Dual C3+M2)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: COMMAND CENTER SHELL (Flex row) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* MOBILE SIDEBAR TOGGLE BUTTON */}
        <div className="md:hidden fixed bottom-6 left-6 z-40">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full shadow-2xl font-bold text-xs"
          >
            <Menu className="h-4 w-4" />
            <span>Menu Tài khoản</span>
          </button>
        </div>

        {/* LEFT SIDEBAR (Width 240px, bg-white border-r) */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-40
            w-[240px] bg-white border-r border-gray-200/80
            flex flex-col justify-between shrink-0
            transform transition-transform duration-200 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Top content */}
          <div className="p-5 flex flex-col items-center border-b border-gray-100">
            {/* Mobile close button */}
            <div className="w-full flex justify-end md:hidden mb-2">
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Avatar (80px, rounded-full) */}
            <div className="relative mb-3 group cursor-pointer" onClick={() => handleSelectTab('profile')}>
              <div className="h-20 w-20 rounded-full overflow-hidden ring-4 ring-primary-50 shadow-md">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                  alt={user?.name || 'User Avatar'}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Trực tuyến" />
            </div>

            {/* Full Name */}
            <h2 className="text-sm font-bold text-gray-900 text-center truncate max-w-[200px]">
              {user?.name || 'Nguyễn Quốc Duy'}
            </h2>
            <p className="text-[11px] text-gray-400 text-center truncate max-w-[200px] mb-2.5">
              {user?.email || 'duy.nguyen@renthub.vn'}
            </p>

            {/* <TierBadge /> (e.g., "C2 Verified" or "M2 Pro") */}
            <div className="flex flex-col items-center gap-1.5">
              <TierBadge role={role} tier={tier} size="md" variant="code" />
              {isDualRole && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  🔄 Hội viên Tuần hoàn Kép
                </span>
              )}
            </div>
          </div>

          {/* NAV LINKS (Vertical stack, py-2, text-sm, icon + text) */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id as TabKey)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl
                      text-xs font-semibold transition-all duration-150 text-left
                      ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-bold shadow-2xs'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || 'bg-primary-100 text-primary-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>

          {/* BOTTOM: "Đăng xuất" (LogOut icon, text-gray-500) */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="h-4 w-4 text-gray-400 hover:text-red-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT (flex-1, bg #F9FAFB, p-6) */}
        <main className="flex-1 bg-[#F9FAFB] p-4 sm:p-6 lg:p-8 min-w-0">
          
          {/* Header breadcrumb & section indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span>RentHub Marketplace</span>
                <span>/</span>
                <span>Tài khoản</span>
                <span>/</span>
                <span className="text-gray-700 font-semibold">{currentNav.label}</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {currentNav.label}
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRelistModalOpen(true)}
                className="gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold"
              >
                <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                <span>Chuyển đồ thuê</span>
              </Button>

              <div className="hidden sm:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs shadow-2xs">
                <span className="text-gray-400 font-medium">Hạng:</span>
                <TierBadge role={role} tier={tier} size="sm" variant="code" />
              </div>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA BASED ON SELECTED SIDEBAR LINK */}
          {activeTab === 'overview' && (
            <OverviewTab
              onSelectTab={handleSelectTab}
              onOpenRelistModal={() => setIsRelistModalOpen(true)}
            />
          )}

          {activeTab === 'renting-in' && (
            <RentingInTab />
          )}

          {activeTab === 'renting-out' && (
            <RentingOutTab onSelectTab={handleSelectTab} />
          )}

          {activeTab === 'b2b-enterprise' && (
            <EnterpriseB2BTab />
          )}

          {activeTab === 'wallet' && (
            <WalletLedgerTab />
          )}

          {activeTab === 'profile' && (
            <ProfileAndTiersTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </main>
      </div>

      {/* Quick Relist Modal */}
      <CircularRelistModal
        isOpen={isRelistModalOpen}
        onClose={() => setIsRelistModalOpen(false)}
      />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Xác nhận Đăng xuất"
        description="Bạn có chắc chắn muốn đăng xuất khỏi Trung tâm Điều khiển RentHub?"
        confirmLabel="Đăng xuất ngay"
        variant="destructive"
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default AccountDashboardPage;
