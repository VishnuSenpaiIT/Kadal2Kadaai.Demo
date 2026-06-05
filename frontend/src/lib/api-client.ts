import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // For Sanctum CSRF cookies if needed
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data, // Unwrap the Axios response to get our standard JSON envelope
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
export { apiClient as api };
