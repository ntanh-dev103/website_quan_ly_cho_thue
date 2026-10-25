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
  RefreshCw,
  Sparkles,
  ArrowRight,
  CheckCircle2
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
    roles,
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

  // Visibility and account flow checks
  const isCustomer = hasRole('CUSTOMER');
  const isMerchant = hasRole('MERCHANT');
  const isM4 = tier === 'M4' || merchantTier === 'M4';
  const isDualRole = isCustomer && isMerchant;
  const isCustomerOnly = isCustomer && !isMerchant && role !== 'ADMIN';
  const isMerchantOnly = isMerchant && !isCustomer && role !== 'ADMIN';
  const isAdmin = role === 'ADMIN';

  // Handler to enable Personal Rental capability (Kích hoạt Cá nhân cho thuê)
  const handleEnablePersonalRental = () => {
    const currentRoles = roles && roles.length > 0 ? roles : [role];
    const nextRoles: any = Array.from(new Set([...currentRoles, 'MERCHANT', 'CUSTOMER']));
    setRoleAndTier('CUSTOMER', tier, nextRoles, customerTier, merchantTier || 'M1');
    toast.success('🎉 Kích hoạt Kênh Cá Nhân Cho Thuê thành công!', {
      description: 'Bạn đã trở thành Hội viên Tuần hoàn Kép. Tab "Cho thuê RA" đã sẵn sàng trong menu!',
      duration: 5000,
    });
    handleSelectTab('renting-out');
  };

  const handleSelectTab = (tab: string) => {
    if (tab === 'activate-renting-out') {
      handleEnablePersonalRental();
      return;
    }
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
      label: isDualRole ? 'Cho thuê RA (Cá nhân)' : 'Cho thuê RA',
      icon: Store,
      visible: isMerchant,
      badge: isDualRole ? 'Cá nhân' : '3 đơn mới',
      badgeColor: isDualRole ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
    },
    ...(!isMerchant ? [{
      id: 'activate-renting-out',
      label: 'Đăng ký Cho thuê cá nhân',
      icon: Sparkles,
      visible: true,
      badge: 'Bật ngay',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    }] : []),
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

  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Top content */}
      <div className="p-5 flex flex-col items-center border-b border-gray-100">
        {/* Mobile close button */}
        {isMobile && (
          <div className="w-full flex justify-end mb-2">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

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

        {/* TierBadge */}
        <div className="flex flex-col items-center gap-1.5">
          {isDualRole ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <TierBadge role="CUSTOMER" tier={activeCTier} size="sm" variant="code" />
                <TierBadge role="MERCHANT" tier={activeMTier} size="sm" variant="code" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                🔄 Cá nhân Cho thuê (Tuần hoàn)
              </span>
            </div>
          ) : (
            <TierBadge role={role} tier={tier} size="md" variant="code" />
          )}
          {isCustomerOnly && (
            <button
              onClick={handleEnablePersonalRental}
              className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Bật cho thuê cá nhân</span>
            </button>
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
                  text-xs font-semibold transition-all duration-150 text-left cursor-pointer
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

      {/* SIDEBAR PROMO FOR PERSONAL RENTAL */}
      {isCustomerOnly && (
        <div className="px-3 pb-2">
          <div className="p-3 bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-50/40 border border-emerald-200/80 rounded-xl text-left shadow-2xs">
            <div className="flex items-center gap-1.5 mb-1 text-emerald-950 font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Cho thuê cá nhân</span>
            </div>
            <p className="text-[11px] text-emerald-800 mb-2 leading-relaxed">
              Tạo nguồn thu nhập từ đồ công nghệ nhàn rỗi với bảo hiểm 100%.
            </p>
            <Button
              size="sm"
              onClick={handleEnablePersonalRental}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-7 rounded-lg shadow-xs gap-1 cursor-pointer"
            >
              <span>Kích hoạt ngay</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* BOTTOM: "Đăng xuất" */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-gray-400 hover:text-red-500" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      
      {/* ACCOUNT FLOW & PERSONAL RENTAL STATUS BAR */}
      <div className="bg-white border-b border-gray-200/90 px-4 py-2.5 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* CASE 1: DUAL ROLE (Cá nhân cho thuê / Tuần hoàn kép) */}
          {isDualRole && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-gray-900">
                      Tài khoản: Cá nhân Cho thuê (Mô hình Tuần hoàn Kép RentHub)
                    </span>
                    <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Đang hoạt động
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 hidden sm:block">
                    Hạng đi thuê: <strong className="text-gray-700">{activeCTier}</strong> • Hạng gian hàng cá nhân: <strong className="text-gray-700">{activeMTier}</strong> • Bảo hiểm RentGuard 100%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleSelectTab('renting-in')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'renting-in'
                      ? 'bg-primary-50 text-primary-700 font-bold border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-primary-600" />
                  <span>Đang thuê VÀO</span>
                </button>

                <button
                  onClick={() => handleSelectTab('renting-out')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'renting-out'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Store className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Cho thuê RA</span>
                </button>

                <Button
                  size="sm"
                  onClick={() => setIsRelistModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg h-8 px-3 shadow-xs gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>+ Đăng đồ cho thuê</span>
                </Button>
              </div>
            </>
          )}

          {/* CASE 2: CUSTOMER ONLY (Chưa kích hoạt cá nhân cho thuê) */}
          {isCustomerOnly && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">
                      Chế độ: Khách thuê cá nhân
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Hạng {activeCTier}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 hidden sm:block">
                    Bạn có thiết bị công nghệ nhàn rỗi? Bật tính năng cho thuê để tạo thêm dòng tiền an toàn với bảo hiểm 100%.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-emerald-700 font-semibold hidden lg:inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 0đ phí duy trì • Ký số tự động
                </span>
                <Button
                  size="sm"
                  onClick={handleEnablePersonalRental}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-lg h-8 px-3.5 shadow-xs gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Bật Cho thuê cá nhân (Miễn phí)</span>
                </Button>
              </div>
            </>
          )}

          {/* CASE 3: MERCHANT ONLY */}
          {isMerchantOnly && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Store className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">
                      Cổng Đối tác Cho thuê Chuyên nghiệp (Merchant Store)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Hạng {activeMTier}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 hidden sm:block">
                    Quản lý danh mục hàng, duyệt đơn hàng và cấu hình mức ký quỹ cho khách hàng.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleSelectTab('renting-out')}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg h-8 px-3 shadow-xs gap-1.5 cursor-pointer"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Gian hàng cho thuê</span>
                </Button>
              </div>
            </>
          )}

          {/* CASE 4: ADMIN */}
          {isAdmin && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900">
                      Tài khoản Quản trị Hệ thống (System Administrator)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                      Root Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 hidden sm:block">
                    Toàn quyền kiểm soát và vận hành sàn thương mại điện tử RentHub.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg h-8 px-3 shadow-xs gap-1.5 cursor-pointer"
                >
                  <span>Mở Cổng Quản Trị /admin →</span>
                </Button>
              </div>
            </>
          )}

        </div>
      </div>

      {/* SECTION 1: COMMAND CENTER SHELL (Flex row) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        
        {/* MOBILE SIDEBAR TOGGLE BUTTON */}
        <div className="md:hidden fixed bottom-6 left-6 z-30">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full shadow-2xl font-bold text-xs hover:bg-gray-800 transition-all cursor-pointer ring-2 ring-white/30"
          >
            <Menu className="h-4 w-4" />
            <span>Menu Tài khoản</span>
          </button>
        </div>

        {/* MOBILE SIDEBAR DRAWER OVERLAY */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
              onClick={() => setIsMobileSidebarOpen(false)} 
            />
            <aside className="relative w-[260px] max-w-[85vw] bg-white h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
              {renderSidebarContent(true)}
            </aside>
          </div>
        )}

        {/* DESKTOP SIDEBAR: Clean flex column inside content container */}
        <aside className="hidden md:flex w-[240px] bg-white border-r border-gray-200/80 flex-col justify-between shrink-0 self-stretch min-h-[calc(100vh-140px)]">
          {renderSidebarContent(false)}
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
              {(isDualRole || isMerchant || activeCTier === 'C3' || activeCTier === 'C4') ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRelistModalOpen(true)}
                  className="gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-bold"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Chuyển đồ thuê</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/catalog')}
                  className="gap-1.5 border-primary-300 text-primary-700 hover:bg-primary-50 text-xs font-bold"
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-primary-600" />
                  <span>Thuê thiết bị mới</span>
                </Button>
              )}

              <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs shadow-2xs">
                <span className="text-gray-400 font-medium">Hạng thành viên:</span>
                {isDualRole ? (
                  <div className="flex items-center gap-1.5">
                    <TierBadge role="CUSTOMER" tier={activeCTier} size="sm" variant="code" />
                    <span className="text-gray-300">/</span>
                    <TierBadge role="MERCHANT" tier={activeMTier} size="sm" variant="code" />
                  </div>
                ) : (
                  <TierBadge role={role} tier={tier} size="sm" variant="code" />
                )}
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
