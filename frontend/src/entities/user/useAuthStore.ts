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

// ===== Store Interface =====
interface AuthStore {
  // State
  role: Role;
  tier: Tier;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: CustomerRegisterData | MerchantRegisterData, role: 'CUSTOMER' | 'MERCHANT') => Promise<void>;
  logout: () => void;

  // Helpers
  getDepositRate: () => number;
  getCommissionRate: () => number;
  canAccess: (requiredRole?: Role, requiredTier?: Tier) => boolean;
}

// ===== Role Hierarchy =====
const ROLE_HIERARCHY: Record<Role, number> = {
  GUEST: 0,
  CUSTOMER: 1,
  MERCHANT: 2,
  ADMIN: 3,
};

// ===== Tier Level Resolver =====
function getTierLevel(tier: Tier): number {
  const customerIdx = CUSTOMER_TIER_HIERARCHY.indexOf(tier as CustomerTier);
  if (customerIdx !== -1) return customerIdx;

  const merchantIdx = MERCHANT_TIER_HIERARCHY.indexOf(tier as MerchantTier);
  if (merchantIdx !== -1) return merchantIdx;

  if (tier === 'A1') return 99; // Admin always has access
  return -1; // G1 (Guest)
}

// ===== Mock Login Logic =====
function resolveRoleAndTier(email: string): { role: Role; tier: Tier } {
  const lower = email.toLowerCase();

  if (lower.startsWith('admin@')) {
    return { role: 'ADMIN', tier: 'A1' };
  }
  if (lower.startsWith('merchant@')) {
    return { role: 'MERCHANT', tier: 'M2' };
  }
  if (lower.startsWith('merchant1@')) {
    return { role: 'MERCHANT', tier: 'M1' };
  }
  if (lower.startsWith('merchant3@')) {
    return { role: 'MERCHANT', tier: 'M3' };
  }
  if (lower.startsWith('merchant4@')) {
    return { role: 'MERCHANT', tier: 'M4' };
  }
  if (lower.startsWith('vip@') || lower.startsWith('diamond@')) {
    return { role: 'CUSTOMER', tier: 'C4' };
  }
  if (lower.startsWith('gold@')) {
    return { role: 'CUSTOMER', tier: 'C3' };
  }
  if (lower.startsWith('silver@')) {
    return { role: 'CUSTOMER', tier: 'C2' };
  }
  // Default customer
  return { role: 'CUSTOMER', tier: 'C1' };
}

// ===== Zustand Store =====
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      role: 'GUEST' as Role,
      tier: 'G1' as Tier,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        await sleep(800); // Simulate API delay

        const { role, tier } = resolveRoleAndTier(email);
        const mockUser: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          phone: '0901234567',
          createdAt: new Date().toISOString(),
          ...(role === 'MERCHANT' && {
            companyName: 'Công ty TNHH Cho Thuê ' + email.split('@')[0],
            taxCode: '0301234567',
          }),
        };

        set({
          role,
          tier,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Register
      register: async (data: CustomerRegisterData | MerchantRegisterData, role: 'CUSTOMER' | 'MERCHANT') => {
        set({ isLoading: true });
        await sleep(1000); // Simulate API delay

        const tier: Tier = role === 'CUSTOMER' ? 'C1' : 'M1';
        const mockUser: User = {
          id: crypto.randomUUID(),
          email: (data as CustomerRegisterData & MerchantRegisterData).email,
          name: 'name' in data ? (data as CustomerRegisterData).name : ('companyName' in data ? (data as MerchantRegisterData).companyName : (data as CustomerRegisterData & MerchantRegisterData).email),
          createdAt: new Date().toISOString(),
          ...('companyName' in data && {
            companyName: (data as MerchantRegisterData).companyName,
            taxCode: (data as MerchantRegisterData).taxCode,
          }),
        };

        set({
          role,
          tier,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // Logout
      logout: () => {
        set({
          role: 'GUEST',
          tier: 'G1',
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // Get deposit rate for current customer tier
      getDepositRate: () => {
        const { role, tier } = get();
        if (role !== 'CUSTOMER') return 0;
        return DEPOSIT_RATES[tier as CustomerTier] ?? 0.40;
      },

      // Get commission rate for current merchant tier
      getCommissionRate: () => {
        const { role, tier } = get();
        if (role !== 'MERCHANT') return 0;
        return COMMISSION_RATES[tier as MerchantTier] ?? 0.15;
      },

      // Check if user can access a given role/tier
      canAccess: (requiredRole?: Role, requiredTier?: Tier) => {
        const { role, tier } = get();

        // Role check
        if (requiredRole && ROLE_HIERARCHY[role] < ROLE_HIERARCHY[requiredRole]) {
          return false;
        }

        // Tier check (only within same role family)
        if (requiredTier) {
          const currentLevel = getTierLevel(tier);
          const requiredLevel = getTierLevel(requiredTier);
          return currentLevel >= requiredLevel;
        }

        return true;
      },
    }),
    {
      name: 'rental-shop-auth',
      partialize: (state) => ({
        role: state.role,
        tier: state.tier,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
