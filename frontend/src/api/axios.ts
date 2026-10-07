import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('credicord_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to catch token expiration & unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const code = error.response.data?.code;
      const isExpired = code === 'TOKEN_EXPIRED';

      // Clear local storage session
      localStorage.removeItem('credicord_auth_token');
      localStorage.removeItem('credicord_user');

      // Dispatch custom window event so reactive composables and UI can react
      window.dispatchEvent(
        new CustomEvent('credicord:session-expired', {
          detail: {
            reason: isExpired ? 'expired' : 'unauthorized',
            message:
              error.response.data?.message ||
              'Tu sesión ha expirado o no es válida. Inicia sesión nuevamente.',
          },
        })
      );

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        const query = isExpired ? '?expired=1' : '?unauthorized=1';
        window.location.href = `/login${query}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
