import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth.api';
import { User } from '../types';

// Global singleton reactive state
const token = ref<string | null>(localStorage.getItem('credicord_auth_token'));
const storedUserJson = localStorage.getItem('credicord_user');
const user = ref<User | null>(storedUserJson ? JSON.parse(storedUserJson) : null);
const isLoading = ref<boolean>(false);
const authError = ref<string | null>(null);
const sessionExpiredNotification = ref<string | null>(null);

// Listen to custom window session expiration event
if (typeof window !== 'undefined') {
  window.addEventListener('credicord:session-expired', (e: any) => {
    token.value = null;
    user.value = null;
    sessionExpiredNotification.value =
      e.detail?.message || 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
  });
}

export function useAuth() {
  const router = useRouter();

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true;
    authError.value = null;
    sessionExpiredNotification.value = null;

    try {
      const response = await authApi.login(credentials);
      token.value = response.data.token;
      user.value = response.data.user;

      localStorage.setItem('credicord_auth_token', response.data.token);
      localStorage.setItem('credicord_user', JSON.stringify(response.data.user));

      if (router) {
        await router.push('/dashboard');
      }
      return true;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors && err.response.data.errors[0]?.message) ||
        'Error al iniciar sesión. Verifica tus credenciales o conexión al servidor.';
      authError.value = msg;
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    try {
      if (token.value) {
        await authApi.logout();
      }
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('credicord_auth_token');
      localStorage.removeItem('credicord_user');
      isLoading.value = false;

      if (router) {
        await router.push('/login');
      }
    }
  };

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('credicord_auth_token');
    if (!savedToken) {
      token.value = null;
      user.value = null;
      return false;
    }

    try {
      const res = await authApi.getMe();
      user.value = res.data;
      localStorage.setItem('credicord_user', JSON.stringify(res.data));
      return true;
    } catch (err) {
      // Interceptor will already handle 401 and redirect if invalid
      token.value = null;
      user.value = null;
      localStorage.removeItem('credicord_auth_token');
      localStorage.removeItem('credicord_user');
      return false;
    }
  };

  const clearErrors = () => {
    authError.value = null;
    sessionExpiredNotification.value = null;
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    authError,
    sessionExpiredNotification,
    login,
    logout,
    checkAuth,
    clearErrors,
  };
}
