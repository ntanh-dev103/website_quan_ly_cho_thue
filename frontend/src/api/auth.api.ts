import axiosClient, { type ApiResponse } from './axiosClient';

export interface BackendUserInfo {
  id: number | string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  avatar?: string;
  address?: string;
  customerTier?: string;
  merchantTier?: string;
  companyName?: string;
  taxCode?: string;
  verifiedIdentity?: boolean;
}

export interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
  userInfo: BackendUserInfo;
}

export interface LoginPayload {
  email?: string;
  username?: string;
  password?: string;
}

export interface RegisterCustomerPayload {
  email: string;
  password?: string;
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface RegisterMerchantPayload {
  email: string;
  password?: string;
  fullName?: string;
  companyName?: string;
  taxCode?: string;
  businessLicense?: string;
  phone?: string;
  address?: string;
}

export const authApi = {
  /**
   * Đăng nhập với email / username và password
   */
  login: async (payload: LoginPayload): Promise<BackendLoginResponse> => {
    const res = await axiosClient.post<any, ApiResponse<BackendLoginResponse>>('/auth/login', payload);
    return res.data;
  },

  /**
   * Đăng ký tài khoản Khách hàng
   */
  registerCustomer: async (payload: RegisterCustomerPayload): Promise<BackendLoginResponse> => {
    const res = await axiosClient.post<any, ApiResponse<BackendLoginResponse>>('/auth/register', {
      ...payload,
      role: 'CUSTOMER',
    });
    return res.data;
  },

  /**
   * Đăng ký tài khoản Thương gia (Merchant)
   */
  registerMerchant: async (payload: RegisterMerchantPayload): Promise<BackendLoginResponse> => {
    const res = await axiosClient.post<any, ApiResponse<BackendLoginResponse>>('/auth/register', {
      ...payload,
      role: 'MERCHANT',
    });
    return res.data;
  },

  /**
   * Lấy thông tin hồ sơ người dùng hiện tại
   */
  getMyProfile: async (): Promise<BackendUserInfo> => {
    const res = await axiosClient.get<any, ApiResponse<BackendUserInfo>>('/users/me');
    return res.data;
  },

  /**
   * Làm mới Access Token
   */
  refreshToken: async (refreshToken: string): Promise<BackendLoginResponse> => {
    const res = await axiosClient.post<any, ApiResponse<BackendLoginResponse>>('/auth/refresh', {
      refreshToken,
    });
    return res.data;
  },
};
