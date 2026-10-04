import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type Role,
  type Tier,
  type User,
  type CustomerTier,
  type MerchantTier,
  type CustomerRegisterData,
  type MerchantRegisterData,
  CUSTOMER_TIER_HIERARCHY,
  MERCHANT_TIER_HIERARCHY,
  DEPOSIT_RATES,
  COMMISSION_RATES,
} from '@/entities/user/user.types';
import { sleep } from '@/shared/lib/utils';
import { authApi } from '@/api/auth.api';

// ===== Store Interface =====
interface AuthStore {
  // State
  role: Role;
  roles: Role[];
  tier: Tier;
  customerTier: CustomerTier;
  merchantTier: MerchantTier;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password?: string) => Promise<void>;
  register: (data: CustomerRegisterData | MerchantRegisterData, role: 'CUSTOMER' | 'MERCHANT') => Promise<void>;
  logout: () => void;
  updateTier: (newTier: Tier) => void;
  updateUser: (data: Partial<User>) => void;
  setRoleAndTier: (role: Role, tier: Tier, roles?: Role[], cTier?: CustomerTier, mTier?: MerchantTier) => void;
  setDualRole: (isDual: boolean, cTier?: CustomerTier, mTier?: MerchantTier) => void;

  // Helpers
  getDepositRate: () => number;
  getCommissionRate: () => number;
  canAccess: (requiredRole?: Role, requiredTier?: Tier) => boolean;
  hasRole: (role: Role) => boolean;
}

// ===== Mock Login Logic =====
function resolveRoleAndTier(email: string): { 
  role: Role; 
  tier: Tier; 
  roles: Role[]; 
  customerTier: CustomerTier; 
  merchantTier: MerchantTier 
} {
  const lower = email.toLowerCase();

  if (lower.startsWith('admin@')) {
    return { role: 'ADMIN', tier: 'A1', roles: ['ADMIN', 'CUSTOMER', 'MERCHANT'], customerTier: 'C4', merchantTier: 'M4' };
  }
  if (lower.startsWith('dual@') || lower.startsWith('circular@')) {
    return { role: 'CUSTOMER', tier: 'C3', roles: ['CUSTOMER', 'MERCHANT'], customerTier: 'C3', merchantTier: 'M2' };
  }
  if (lower.startsWith('merchant4@')) {
    return { role: 'MERCHANT', tier: 'M4', roles: ['MERCHANT'], customerTier: 'C1', merchantTier: 'M4' };
  }
  if (lower.startsWith('merchant3@')) {
    return { role: 'MERCHANT', tier: 'M3', roles: ['MERCHANT'], customerTier: 'C1', merchantTier: 'M3' };
  }
  if (lower.startsWith('merchant1@')) {
    return { role: 'MERCHANT', tier: 'M1', roles: ['MERCHANT'], customerTier: 'C1', merchantTier: 'M1' };
  }
  if (lower.startsWith('merchant@')) {
    return { role: 'MERCHANT', tier: 'M2', roles: ['MERCHANT'], customerTier: 'C1', merchantTier: 'M2' };
  }
  if (lower.startsWith('vip@') || lower.startsWith('diamond@')) {
    return { role: 'CUSTOMER', tier: 'C4', roles: ['CUSTOMER'], customerTier: 'C4', merchantTier: 'M1' };
  }
  if (lower.startsWith('gold@')) {
    return { role: 'CUSTOMER', tier: 'C3', roles: ['CUSTOMER'], customerTier: 'C3', merchantTier: 'M1' };
  }
  if (lower.startsWith('silver@')) {
    return { role: 'CUSTOMER', tier: 'C2', roles: ['CUSTOMER'], customerTier: 'C2', merchantTier: 'M1' };
  }
  // Default customer
  return { role: 'CUSTOMER', tier: 'C1', roles: ['CUSTOMER'], customerTier: 'C1', merchantTier: 'M1' };
}

// ===== Zustand Store =====
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      role: 'CUSTOMER' as Role,
      roles: ['CUSTOMER', 'MERCHANT'] as Role[],
      tier: 'C2' as Tier,
      customerTier: 'C2' as CustomerTier,
      merchantTier: 'M2' as MerchantTier,
      user: {
        id: 'usr-renthub-demo',
        email: 'duy.nguyen@renthub.vn',
        name: 'Nguyễn Quốc Duy',
        phone: '0912 345 678',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        address: 'Số 45, Đường Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        companyName: 'DuyTech Media & Equipment Rental',
        taxCode: '0318921832',
        roles: ['CUSTOMER', 'MERCHANT'],
        customerTier: 'C2',
        merchantTier: 'M2',
        verifiedIdentity: true,
        createdAt: '2025-01-15T08:00:00Z',
      },
      isAuthenticated: true,
      isLoading: false,

      // Login
      login: async (email: string, password = 'password') => {
        set({ isLoading: true });
        
        try {
          // 1. Thử gọi API Backend thực tế
          const res = await authApi.login({ email, password });
          if (res?.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            if (res.refreshToken) {
              localStorage.setItem('refreshToken', res.refreshToken);
            }

            const info = res.userInfo;
            const mappedRole: Role = (info.role?.replace('ROLE_', '') as Role) || 'CUSTOMER';
            const cTier: CustomerTier = (info.customerTier as CustomerTier) || 'C1';
            const mTier: MerchantTier = (info.merchantTier as MerchantTier) || 'M1';
            const mappedTier: Tier = mappedRole === 'ADMIN' ? 'A1' : (mappedRole === 'MERCHANT' ? mTier : cTier);

            const activeUser: User = {
              id: String(info.id),
              email: info.email || email,
              name: info.fullName || email.split('@')[0],
              phone: info.phone || '',
              avatar: info.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
              address: info.address || 'TP. Hồ Chí Minh',
              roles: [mappedRole],
              customerTier: cTier,
              merchantTier: mTier,
              companyName: info.companyName,
              taxCode: info.taxCode,
              verifiedIdentity: info.verifiedIdentity || false,
              createdAt: new Date().toISOString(),
            };

            set({
              role: mappedRole,
              roles: [mappedRole],
              tier: mappedTier,
              customerTier: cTier,
              merchantTier: mTier,
              user: activeUser,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch (apiErr: any) {
          // Nếu backend trả về lỗi từ server (400, 401: sai pass hoặc tài khoản không đúng), ném ra cho UI hiển thị
          if (apiErr?.response?.status && apiErr.response.status < 500) {
            set({ isLoading: false });
            throw apiErr;
          }
          console.info('Backend API chưa sẵn sàng hoặc ngoại lệ kết nối, chuyển sang chế độ Mock/Demo Auth:', apiErr?.message);
        }

        // 2. Chế độ Mock Fallback (Đảm bảo đồ án luôn hoạt động mượt mà khi trình diễn offline)
        await sleep(400);
        const { role, tier, roles, customerTier, merchantTier } = resolveRoleAndTier(email);
        const mockUser: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          phone: '0901234567',
          address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
          roles,
          customerTier,
          merchantTier,
          verifiedIdentity: tier !== 'C1',
          createdAt: new Date().toISOString(),
          ...(roles.includes('MERCHANT') && {
            companyName: 'Công ty TNHH Cho Thuê ' + email.split('@')[0],
            taxCode: '0301234567',
          }),
        };

        set({
          role,
          roles,
          tier,
          customerTier,
          merchantTier,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Register
      register: async (data: CustomerRegisterData | MerchantRegisterData, role: 'CUSTOMER' | 'MERCHANT') => {
        set({ isLoading: true });

        try {
          // 1. Thử gọi API Backend đăng ký
          const email = (data as any).email;
          const password = (data as any).password || '123456';
          const fullName = 'name' in data ? (data as CustomerRegisterData).name : (data as any).fullName || ('companyName' in data ? (data as MerchantRegisterData).companyName : email);

          let res;
          if (role === 'MERCHANT') {
            const mData = data as MerchantRegisterData;
            const licenseStr = mData.businessLicense instanceof File 
              ? mData.businessLicense.name 
              : (typeof mData.businessLicense === 'string' ? mData.businessLicense : undefined);

            res = await authApi.registerMerchant({
              email,
              password,
              fullName,
              companyName: mData.companyName,
              taxCode: mData.taxCode,
              businessLicense: licenseStr,
              phone: (data as any).phone,
            });
          } else {
            const cData = data as CustomerRegisterData;
            res = await authApi.registerCustomer({
              email,
              password,
              fullName,
              phone: (cData as any).phone,
              address: (cData as any).address,
            });
          }

          if (res?.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            if (res.refreshToken) {
              localStorage.setItem('refreshToken', res.refreshToken);
            }

            const info = res.userInfo;
            const mappedRole: Role = (info.role?.replace('ROLE_', '') as Role) || role;
            const cTier: CustomerTier = (info.customerTier as CustomerTier) || 'C1';
            const mTier: MerchantTier = (info.merchantTier as MerchantTier) || 'M1';
            const mappedTier: Tier = mappedRole === 'MERCHANT' ? mTier : cTier;

            const activeUser: User = {
              id: String(info.id),
              email: info.email || email,
              name: info.fullName || fullName,
              phone: info.phone,
              avatar: info.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
              address: info.address || 'TP. Hồ Chí Minh',
              roles: [mappedRole],
              customerTier: cTier,
              merchantTier: mTier,
              companyName: info.companyName,
              taxCode: info.taxCode,
              verifiedIdentity: false,
              createdAt: new Date().toISOString(),
            };

            set({
              role: mappedRole,
              roles: [mappedRole],
              tier: mappedTier,
              customerTier: cTier,
              merchantTier: mTier,
              user: activeUser,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch (apiErr: any) {
          if (apiErr?.response?.status && apiErr.response.status < 500) {
            set({ isLoading: false });
            throw apiErr;
          }
          console.info('Backend register offline, fallback to mock register:', apiErr?.message);
        }

        // 2. Mock Fallback
        await sleep(500);
        const tier: Tier = role === 'CUSTOMER' ? 'C1' : 'M1';
        const roles: Role[] = [role];
        const mockUser: User = {
          id: crypto.randomUUID(),
          email: (data as CustomerRegisterData & MerchantRegisterData).email,
          name: 'name' in data ? (data as CustomerRegisterData).name : ('companyName' in data ? (data as MerchantRegisterData).companyName : (data as CustomerRegisterData & MerchantRegisterData).email),
          address: 'TP. Hồ Chí Minh, Việt Nam',
          roles,
          customerTier: 'C1',
          merchantTier: 'M1',
          verifiedIdentity: false,
          createdAt: new Date().toISOString(),
          ...('companyName' in data && {
            companyName: (data as MerchantRegisterData).companyName,
            taxCode: (data as MerchantRegisterData).taxCode,
          }),
        };

        set({
          role,
          roles,
          tier,
          customerTier: 'C1',
          merchantTier: 'M1',
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Logout
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          role: 'GUEST',
          roles: ['GUEST'],
          tier: 'G1',
          customerTier: 'C1',
          merchantTier: 'M1',
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Update Tier directly (e.g. from KYC or upgrade)
      updateTier: (newTier: Tier) => {
        set((state) => {
          const isCustomerTier = CUSTOMER_TIER_HIERARCHY.includes(newTier as CustomerTier);
          const isMerchantTier = MERCHANT_TIER_HIERARCHY.includes(newTier as MerchantTier);

          const nextCustomerTier = isCustomerTier ? (newTier as CustomerTier) : state.customerTier;
          const nextMerchantTier = isMerchantTier ? (newTier as MerchantTier) : state.merchantTier;
          
          return {
            tier: newTier,
            customerTier: nextCustomerTier,
            merchantTier: nextMerchantTier,
            user: state.user
              ? {
                  ...state.user,
                  customerTier: nextCustomerTier,
                  merchantTier: nextMerchantTier,
                  verifiedIdentity: newTier === 'C2' || state.user.verifiedIdentity,
                }
              : null,
          };
        });
      },

      // Update User profile fields
      updateUser: (patch: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        }));
      },

      // Set arbitrary role and tier
      setRoleAndTier: (role: Role, tier: Tier, roles?: Role[], cTier?: CustomerTier, mTier?: MerchantTier) => {
        const computedRoles = roles ?? (role === 'GUEST' ? ['GUEST'] : [role]);
        const computedCTier = cTier ?? (tier.startsWith('C') ? (tier as CustomerTier) : 'C2');
        const computedMTier = mTier ?? (tier.startsWith('M') ? (tier as MerchantTier) : 'M2');

        set((state) => ({
          role,
          tier,
          roles: computedRoles,
          customerTier: computedCTier,
          merchantTier: computedMTier,
          isAuthenticated: role !== 'GUEST',
          user: state.user
            ? {
                ...state.user,
                roles: computedRoles,
                customerTier: computedCTier,
                merchantTier: computedMTier,
              }
            : {
                id: 'usr-renthub-demo',
                email: 'demo@renthub.vn',
                name: 'Nguyễn Quốc Duy',
                phone: '0912 345 678',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
                address: 'Số 45, Đường Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
                roles: computedRoles,
                customerTier: computedCTier,
                merchantTier: computedMTier,
                createdAt: '2025-01-15T08:00:00Z',
              },
        }));
      },

      // Switch dual role mode
      setDualRole: (isDual: boolean, cTier: CustomerTier = 'C3', mTier: MerchantTier = 'M2') => {
        if (isDual) {
          set((state) => ({
            role: 'CUSTOMER',
            roles: ['CUSTOMER', 'MERCHANT'],
            tier: cTier,
            customerTier: cTier,
            merchantTier: mTier,
            user: state.user ? {
              ...state.user,
              roles: ['CUSTOMER', 'MERCHANT'],
              customerTier: cTier,
              merchantTier: mTier,
            } : null,
          }));
        } else {
          set((state) => ({
            role: 'CUSTOMER',
            roles: ['CUSTOMER'],
            tier: cTier,
            customerTier: cTier,
            user: state.user ? {
              ...state.user,
              roles: ['CUSTOMER'],
              customerTier: cTier,
            } : null,
          }));
        }
      },

      // Check if user has a specific role (supports multiple roles / dual roles)
      hasRole: (targetRole: Role) => {
        const { role, roles } = get();
        if (role === 'ADMIN' || roles?.includes('ADMIN')) return true;
        if (roles && roles.length > 0) {
          return roles.includes(targetRole);
        }
        return role === targetRole;
      },

      // Get deposit rate for current customer tier
      getDepositRate: () => {
        const { role, roles, tier, customerTier } = get();
        const activeCTier = (tier.startsWith('C') ? tier : customerTier) as CustomerTier;
        if (role !== 'CUSTOMER' && !roles?.includes('CUSTOMER')) return 0;
        return DEPOSIT_RATES[activeCTier] ?? 0.30;
      },

      // Get commission rate for current merchant tier
      getCommissionRate: () => {
        const { role, roles, tier, merchantTier } = get();
        const activeMTier = (tier.startsWith('M') ? tier : merchantTier) as MerchantTier;
        if (role !== 'MERCHANT' && !roles?.includes('MERCHANT')) return 0;
        return COMMISSION_RATES[activeMTier] ?? 0.10;
      },

      // Check if user can access a given role/tier
      canAccess: (requiredRole?: Role, requiredTier?: Tier) => {
        const { role, roles, tier, customerTier, merchantTier } = get();

        // Admin always has full access
        if (role === 'ADMIN' || roles?.includes('ADMIN') || tier === 'A1') {
          return true;
        }

        // Role check
        if (requiredRole) {
          const userRoles = roles && roles.length > 0 ? roles : [role];
          if (requiredRole === 'ADMIN') {
            if (!userRoles.includes('ADMIN')) return false;
          } else if (requiredRole === 'MERCHANT') {
            if (!userRoles.includes('MERCHANT')) return false;
          } else if (requiredRole === 'CUSTOMER') {
            if (!userRoles.includes('CUSTOMER')) return false;
          }
        }

        // Tier check
        if (requiredTier) {
          if (requiredTier.startsWith('M')) {
            const activeTier = tier.startsWith('M') ? (tier as MerchantTier) : merchantTier;
            const currentLevel = MERCHANT_TIER_HIERARCHY.indexOf(activeTier);
            const requiredLevel = MERCHANT_TIER_HIERARCHY.indexOf(requiredTier as MerchantTier);
            if (currentLevel < requiredLevel) return false;
          } else if (requiredTier.startsWith('C')) {
            const activeTier = tier.startsWith('C') ? (tier as CustomerTier) : customerTier;
            const currentLevel = CUSTOMER_TIER_HIERARCHY.indexOf(activeTier);
            const requiredLevel = CUSTOMER_TIER_HIERARCHY.indexOf(requiredTier as CustomerTier);
            if (currentLevel < requiredLevel) return false;
          }
        }

        return true;
      },
    }),
    {
      name: 'rental-shop-auth',
      partialize: (state) => ({
        role: state.role,
        roles: state.roles,
        tier: state.tier,
        customerTier: state.customerTier,
        merchantTier: state.merchantTier,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
