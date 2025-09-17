import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';  // Thay bằng URL backend FastAPI

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Gửi cookie nếu cần (nhưng chúng ta sẽ set header manual)
});

// Interceptor cho request: Thêm Authorization header nếu có access_token
api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor cho response: Handle 401 bằng cách refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Tránh loop vô tận
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          // Gọi refresh endpoint (không cần header vì gửi body)
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
          const newAccessToken = data.access_token;
          Cookies.set('access_token', newAccessToken, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
          // Retry request gốc với token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh fail -> Logout hoặc redirect login
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/auth/login';  // Redirect ở client
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;