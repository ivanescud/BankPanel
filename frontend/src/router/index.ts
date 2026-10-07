import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import UsersView from '../views/UsersView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true, title: 'Iniciar Sesión | Credicord Bank' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Panel de Control | Credicord Bank' },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersView,
    meta: { requiresAuth: true, title: 'Gestión de Usuarios | Credicord Bank' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '404 - No Encontrado | Credicord Bank' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for protected routes
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('credicord_auth_token');
  const isAuthenticated = !!token;

  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Attempting to access protected route without being logged in
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    // Already authenticated, redirect to dashboard
    return next({ path: '/dashboard' });
  }

  next();
});

export default router;
