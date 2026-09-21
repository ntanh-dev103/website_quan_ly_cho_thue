// ===== Role & Tier Types =====

export type Role = 'GUEST' | 'CUSTOMER' | 'MERCHANT' | 'ADMIN';

export type CustomerTier = 'C1' | 'C2' | 'C3' | 'C4';
export type MerchantTier = 'M1' | 'M2' | 'M3' | 'M4';
export type AdminTier = 'A1';
export type GuestTier = 'G1' | 'G2';

export type Tier = GuestTier | CustomerTier | MerchantTier | AdminTier;

// ===== Tier Hierarchy (higher index = higher tier) =====
export const CUSTOMER_TIER_HIERARCHY: CustomerTier[] = ['C1', 'C2', 'C3', 'C4'];
export const MERCHANT_TIER_HIERARCHY: MerchantTier[] = ['M1', 'M2', 'M3', 'M4'];

// ===== Tier Display Info =====
export interface TierInfo {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CUSTOMER_TIER_INFO: Record<CustomerTier, TierInfo> = {
  C1: { label: 'Cơ bản', icon: '🔹', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  C2: { label: 'Bạc', icon: '🥈', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' },
  C3: { label: 'Vàng', icon: '👑', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' },
  C4: { label: 'Kim cương', icon: '💎', color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-300' },
};

export const MERCHANT_TIER_INFO: Record<MerchantTier, TierInfo> = {
  M1: { label: 'Cơ bản', icon: '🔹', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  M2: { label: 'Bạc', icon: '🥈', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' },
  M3: { label: 'Vàng', icon: '👑', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' },
  M4: { label: 'Kim cương', icon: '💎', color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-300' },
};

// ===== Deposit & Commission Rates =====
export const DEPOSIT_RATES: Record<CustomerTier, number> = {
  C1: 0.40,
  C2: 0.30,
  C3: 0.15,
  C4: 0.00,
};

export const COMMISSION_RATES: Record<MerchantTier, number> = {
  M1: 0.15,
  M2: 0.10,
  M3: 0.05,
  M4: 0.02,
};

// ===== User Type =====
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  companyName?: string;
  taxCode?: string;
  createdAt: string;
}

// ===== Auth State =====
export interface AuthState {
  role: Role;
  tier: Tier;
  user: User | null;
  isAuthenticated: boolean;
}

// ===== Contract Status =====
export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_DEPOSIT'
  | 'ACTIVE'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'CANCELLED';

export const CONTRACT_STATUS_INFO: Record<ContractStatus, { label: string; color: string; bgColor: string }> = {
  DRAFT: { label: 'Nháp', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  PENDING_DEPOSIT: { label: 'Chờ đặt cọc', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  ACTIVE: { label: 'Đang thuê', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  OVERDUE: { label: 'Quá hạn', color: 'text-red-700', bgColor: 'bg-red-100' },
  COMPLETED: { label: 'Hoàn thành', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  CANCELLED: { label: 'Đã hủy', color: 'text-slate-600', bgColor: 'bg-slate-100' },
};

// ===== Item Status =====
export type ItemStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RETIRED';

export const ITEM_STATUS_INFO: Record<ItemStatus, { label: string; color: string; bgColor: string }> = {
  AVAILABLE: { label: 'Sẵn sàng', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  RENTED: { label: 'Đang cho thuê', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  MAINTENANCE: { label: 'Bảo trì', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  RETIRED: { label: 'Ngừng hoạt động', color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

// ===== Registration Types =====
export interface CustomerRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface MerchantRegisterData {
  companyName: string;
  taxCode: string;
  email: string;
  password: string;
  businessLicense?: File;
}
