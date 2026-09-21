import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor - Đính kèm JWT vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Bóc tách data từ ApiResponse, hiện Toast lỗi
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data bên trong ApiResponse (bỏ qua wrapper code/message)
    return response.data;
  },
  async (error) => {
    const { response } = error;

    if (response) {
      const { code, message } = response.data || {};
      const errorMessage = message || 'Đã có lỗi xảy ra';

      switch (response.status) {
        case 400:
          toast.error(`Lỗi: ${errorMessage}`);
          break;
        case 401:
          toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          // Thử refresh token
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken && !error.config._retry) {
            error.config._retry = true;
            try {
              const res = await axios.post('http://localhost:8080/api/auth/refresh', {
                refreshToken,
              });
              const { accessToken } = res.data.data;
              localStorage.setItem('accessToken', accessToken);
              error.config.headers.Authorization = `Bearer ${accessToken}`;
              return axiosClient(error.config);
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('Bạn không có quyền thực hiện hành động này.');
          break;
        case 404:
          toast.error(`Không tìm thấy: ${errorMessage}`);
          break;
        case 409:
          toast.error(`Xung đột: ${errorMessage}`);
          break;
        case 500:
          toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
          break;
        default:
          toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error('Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng.');
    } else {
      toast.error('Đã có lỗi xảy ra.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
