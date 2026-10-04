import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor - Đính kèm JWT vào header
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Bóc tách data từ ApiResponse, hiện Toast thông báo lỗi nếu cần
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data bên trong ApiResponse (bỏ qua wrapper code/message nếu là ApiResponse chuẩn)
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'code' in response.data) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    const { response } = error;

    if (response) {
      const { message } = response.data || {};
      const errorMessage = message || 'Đã có lỗi xảy ra trên hệ thống';

      switch (response.status) {
        case 400:
          toast.error(errorMessage);
          break;
        case 401: {
          // Thử refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

          if (refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const res = await axios.post<ApiResponse<{ accessToken: string }>>('/api/auth/refresh', {
                refreshToken,
              });
              const newAccessToken = res.data.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);

              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              }
              return axiosClient(originalRequest);
            } catch {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
              return Promise.reject(error);
            }
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
          break;
        }
        case 403:
          toast.error('Bạn không có quyền thực hiện hành động này');
          break;
        case 404:
          toast.error(errorMessage);
          break;
        case 409:
          toast.error(errorMessage);
          break;
        case 500:
          toast.error('Lỗi máy chủ nội bộ. Vui lòng thử lại sau');
          break;
        default:
          toast.error(errorMessage);
      }
    } else if (error.request) {
      // Backend có thể đang tắt, không kết nối được
      console.warn('Không thể kết nối đến máy chủ backend tại /api');
    } else {
      toast.error('Đã có lỗi xảy ra.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
