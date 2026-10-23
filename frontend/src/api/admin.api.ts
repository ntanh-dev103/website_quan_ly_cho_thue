import axiosClient from './axiosClient';

export interface AdminDashboardStatsDto {
  totalUsersCount: number;
  customerCount: number;
  merchantCount: number;
  totalProductsCount: number;
  totalActiveContractsCount: number;
  totalPlatformRevenue: number;
  pendingMerchantApplicationsCount: number;
  occupancyRate: number;
}

export interface AdminUserDto {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MERCHANT' | 'CUSTOMER' | 'CASHIER' | 'WAREHOUSE';
  phone?: string;
  avatar?: string;
  address?: string;
  customerTier: 'C1' | 'C2' | 'C3' | 'C4';
  merchantTier: 'M1' | 'M2' | 'M3' | 'M4';
  companyName?: string;
  taxCode?: string;
  verifiedIdentity: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface MerchantApplicationDto {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  companyName: string;
  taxCode: string;
  businessLicense: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  merchantTier: string;
  verifiedIdentity: boolean;
  createdAt: string;
  rejectionReason?: string;
}

export interface TierConfigDto {
  id: string; // "C1", "C2", ..., "M1", "M2"
  name: string;
  type: 'CUSTOMER' | 'MERCHANT';
  rate: number; // % deposit or % commission
  maxLimits: string;
  priorityScore: number;
}

export interface UpdateTierConfigReq {
  rate: number;
  name?: string;
  maxLimits?: string;
  priorityScore?: number;
}

export interface UpdateUserTierReq {
  tier: string;
  type?: 'CUSTOMER' | 'MERCHANT';
}

export const adminApi = {
  getStats: async (): Promise<AdminDashboardStatsDto> => {
    try {
      const response = await axiosClient.get('/admin/stats');
      return response.data?.data || response.data;
    } catch {
      return {
        totalUsersCount: 1248,
        customerCount: 1120,
        merchantCount: 128,
        totalProductsCount: 856,
        totalActiveContractsCount: 342,
        totalPlatformRevenue: 185000000,
        pendingMerchantApplicationsCount: 5,
        occupancyRate: 46.8,
      };
    }
  },

  getUsers: async (
    role?: string,
    isActive?: boolean,
    search?: string,
    page = 0,
    size = 20
  ): Promise<{ content: AdminUserDto[]; totalElements: number }> => {
    try {
      const params: Record<string, any> = { page, size };
      if (role && role !== 'ALL') params.role = role;
      if (isActive !== undefined) params.isActive = isActive;
      if (search) params.search = search;
      const response = await axiosClient.get('/admin/users', { params });
      return response.data?.data || response.data;
    } catch {
      return {
        content: [
          {
            id: 1,
            username: 'admin',
            email: 'admin@renthub.vn',
            fullName: 'Quản trị viên Hệ thống',
            role: 'ADMIN',
            phone: '0901234567',
            customerTier: 'C4',
            merchantTier: 'M4',
            verifiedIdentity: true,
            isActive: true,
            createdAt: '2026-01-01 08:00:00',
          },
          {
            id: 2,
            username: 'merchant_hanoi',
            email: 'contact@hanoigear.vn',
            fullName: 'Hà Nội Drone & Event Gear',
            role: 'MERCHANT',
            phone: '0988776655',
            companyName: 'Công ty TNHH Hà Nội Gear',
            taxCode: '0109988776',
            customerTier: 'C2',
            merchantTier: 'M2',
            verifiedIdentity: true,
            isActive: true,
            createdAt: '2026-02-15 10:30:00',
          },
          {
            id: 3,
            username: 'nguyen_van_a',
            email: 'nguyenvana@gmail.com',
            fullName: 'Nguyễn Văn An',
            role: 'CUSTOMER',
            phone: '0912345678',
            customerTier: 'C2',
            merchantTier: 'M1',
            verifiedIdentity: true,
            isActive: true,
            createdAt: '2026-03-01 14:20:00',
          },
          {
            id: 4,
            username: 'saigontech',
            email: 'saigontech@rent.vn',
            fullName: 'Công ty TNHH Thiết Bị Số Sài Gòn',
            role: 'MERCHANT',
            phone: '0933221100',
            companyName: 'Công ty TNHH Thiết Bị Số Sài Gòn',
            taxCode: '0308877665',
            customerTier: 'C1',
            merchantTier: 'M1',
            verifiedIdentity: false,
            isActive: true,
            createdAt: '2026-03-10 16:45:00',
          },
        ],
        totalElements: 4,
      };
    }
  },

  toggleUserStatus: async (userId: number | string): Promise<AdminUserDto> => {
    const response = await axiosClient.put(`/admin/users/${userId}/toggle-status`);
    return response.data?.data || response.data;
  },

  updateUserTier: async (userId: number | string, req: UpdateUserTierReq): Promise<AdminUserDto> => {
    const response = await axiosClient.put(`/admin/users/${userId}/tier`, req);
    return response.data?.data || response.data;
  },

  getPendingMerchants: async (): Promise<MerchantApplicationDto[]> => {
    try {
      const response = await axiosClient.get('/admin/merchants/pending');
      return response.data?.data || response.data;
    } catch {
      return [
        {
          id: 4,
          username: 'saigontech',
          email: 'saigontech@rent.vn',
          fullName: 'Trần Minh Quân',
          phone: '0933221100',
          companyName: 'Công ty TNHH Thiết Bị Số Sài Gòn',
          taxCode: '0308877665',
          businessLicense: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=800&q=80',
          status: 'PENDING',
          merchantTier: 'M1',
          verifiedIdentity: false,
          createdAt: '2026-03-10 16:45:00',
        },
        {
          id: 5,
          username: 'camera_pro',
          email: 'quan.camera@gmail.com',
          fullName: 'Camera Pro Studio - Minh Quân',
          phone: '0909887766',
          companyName: 'Studio Minh Quân Cá Nhân',
          taxCode: '8392019283',
          businessLicense: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          status: 'PENDING',
          merchantTier: 'M1',
          verifiedIdentity: false,
          createdAt: '2026-03-12 09:15:00',
        },
      ];
    }
  },

  approveMerchant: async (userId: number | string, initialTier = 'M2'): Promise<MerchantApplicationDto> => {
    const response = await axiosClient.put(`/admin/merchants/${userId}/approve`, null, {
      params: { initialTier },
    });
    return response.data?.data || response.data;
  },

  rejectMerchant: async (userId: number | string, reason: string): Promise<MerchantApplicationDto> => {
    const response = await axiosClient.put(`/admin/merchants/${userId}/reject`, { reason });
    return response.data?.data || response.data;
  },

  getTierConfigs: async (): Promise<TierConfigDto[]> => {
    try {
      const response = await axiosClient.get('/admin/tiers');
      return response.data?.data || response.data;
    } catch {
      return [
        { id: 'C1', name: 'Thành viên mới (C1)', type: 'CUSTOMER', rate: 40, maxLimits: '2 đơn / lúc', priorityScore: 1 },
        { id: 'C2', name: 'Thành viên Bạc (C2)', type: 'CUSTOMER', rate: 30, maxLimits: '5 đơn / lúc', priorityScore: 2 },
        { id: 'C3', name: 'Thành viên Vàng (C3)', type: 'CUSTOMER', rate: 15, maxLimits: '10 đơn / lúc', priorityScore: 3 },
        { id: 'C4', name: 'Khách hàng VIP (C4)', type: 'CUSTOMER', rate: 0, maxLimits: 'Không giới hạn', priorityScore: 5 },
        { id: 'M1', name: 'Đối tác mới (M1 Starter)', type: 'MERCHANT', rate: 15, maxLimits: 'Tối đa 20 SP', priorityScore: 1 },
        { id: 'M2', name: 'Cửa hàng Pro (M2)', type: 'MERCHANT', rate: 10, maxLimits: 'Không giới hạn SP', priorityScore: 2 },
        { id: 'M3', name: 'Đại lý lớn (M3)', type: 'MERCHANT', rate: 5, maxLimits: 'Không giới hạn SP', priorityScore: 3 },
        { id: 'M4', name: 'Đối tác Chiến lược (M4)', type: 'MERCHANT', rate: 2, maxLimits: 'Không giới hạn & B2B Net-30', priorityScore: 5 },
      ];
    }
  },

  updateTierConfig: async (tierId: string, req: UpdateTierConfigReq): Promise<TierConfigDto> => {
    const response = await axiosClient.put(`/admin/tiers/${tierId}`, req);
    return response.data?.data || response.data;
  },
};
