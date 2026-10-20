import axiosClient from './axiosClient';
import type { ContractResponseDto } from './contract.api';

export interface ProductItemDto {
  id: number;
  productId: number;
  productName?: string;
  skuCode: string;
  serialNumber?: string;
  barcode?: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED' | 'RETIRED';
  conditionScore?: number;
  warehouseLocation?: string;
  notes?: string;
}

export interface CreateProductItemReq {
  skuCode?: string;
  serialNumber: string;
  barcode?: string;
  status?: string;
  conditionScore?: number;
  warehouseLocation?: string;
  notes?: string;
}

export interface UpdateItemStatusReq {
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED' | 'RETIRED';
  notes?: string;
  conditionScore?: number;
  warehouseLocation?: string;
}

export interface MerchantRevenueStatsDto {
  grossRevenue: number;
  platformCommission: number;
  netRevenue: number;
  activeRentalsCount: number;
  totalItemsCount: number;
  availableItemsCount: number;
  maintenanceItemsCount: number;
  occupancyRate: number;
  merchantTier: string;
  commissionRate: number;
  productCount: number;
  productLimit: number;
}

export const merchantApi = {
  getStats: async (merchantId?: number): Promise<MerchantRevenueStatsDto> => {
    try {
      const response = await axiosClient.get('/merchant/stats', {
        params: merchantId ? { merchantId } : undefined,
      });
      return response.data?.data || response.data;
    } catch {
      // Fallback fallback mock if offline
      return {
        grossRevenue: 45000000,
        platformCommission: 6750000,
        netRevenue: 38250000,
        activeRentalsCount: 12,
        totalItemsCount: 35,
        availableItemsCount: 20,
        maintenanceItemsCount: 3,
        occupancyRate: 34.3,
        merchantTier: 'M1',
        commissionRate: 0.15,
        productCount: 14,
        productLimit: 20,
      };
    }
  },

  getContracts: async (merchantId?: number, status?: string, page = 0, size = 10): Promise<{ content: ContractResponseDto[]; totalElements: number }> => {
    try {
      const params: Record<string, any> = { page, size };
      if (merchantId) params.merchantId = merchantId;
      if (status && status !== 'ALL') params.status = status;
      const response = await axiosClient.get('/merchant/contracts', { params });
      return response.data?.data || response.data;
    } catch {
      return { content: [], totalElements: 0 };
    }
  },

  approveContract: async (contractId: number | string, merchantId?: number): Promise<ContractResponseDto> => {
    const response = await axiosClient.put(`/merchant/contracts/${contractId}/approve`, null, {
      params: merchantId ? { merchantId } : undefined,
    });
    return response.data?.data || response.data;
  },

  rejectContract: async (contractId: number | string, reason?: string, merchantId?: number): Promise<ContractResponseDto> => {
    const response = await axiosClient.put(
      `/merchant/contracts/${contractId}/reject`,
      { reason },
      { params: merchantId ? { merchantId } : undefined }
    );
    return response.data?.data || response.data;
  },

  getItemsByProductId: async (productId: number): Promise<ProductItemDto[]> => {
    try {
      const response = await axiosClient.get(`/products/${productId}/items`);
      return response.data?.data || response.data || [];
    } catch {
      return [];
    }
  },

  getMerchantItems: async (merchantId?: number): Promise<ProductItemDto[]> => {
    try {
      const response = await axiosClient.get('/inventory/items', {
        params: merchantId ? { merchantId } : undefined,
      });
      return response.data?.data || response.data || [];
    } catch {
      return [];
    }
  },

  createProductItem: async (productId: number, req: CreateProductItemReq): Promise<ProductItemDto> => {
    const response = await axiosClient.post(`/products/${productId}/items`, req);
    return response.data?.data || response.data;
  },

  updateItemStatus: async (itemId: number, req: UpdateItemStatusReq): Promise<ProductItemDto> => {
    const response = await axiosClient.put(`/inventory/items/${itemId}/status`, req);
    return response.data?.data || response.data;
  },

  deleteProductItem: async (itemId: number): Promise<void> => {
    await axiosClient.delete(`/inventory/items/${itemId}`);
  },
};
