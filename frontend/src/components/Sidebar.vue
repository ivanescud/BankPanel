<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import CredicordLogo from './CredicordLogo.vue';
import {
  LayoutDashboard,
  Users,
  Server,
  LogOut,
  X,
  ShieldCheck
} from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();

const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Métricas',
  },
  {
    name: 'Usuarios y Cuentas',
    path: '/users',
    icon: Users,
    badge: 'Directorio',
  },
];

const handleNav = (path: string) => {
  router.push(path);
  emit('close');
};
</script>

<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="isOpen"
      @click="emit('close')"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div>
        <!-- Top Brand Section -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <CredicordLogo size="sm" :showBadge="false" />
          <button @click="emit('close')" class="lg:hidden p-1.5 text-slate-400 hover:text-slate-700">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Navigation Section -->
        <div class="p-4 space-y-1.5">
          <div class="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menú Principal
          </div>

          <button
            v-for="item in navItems"
            :key="item.path"
            @click="handleNav(item.path)"
            :class="[
              'w-full flex items-center justify-between px-3.5 py-3 text-sm font-semibold transition-all group',
              route.path === item.path
                ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            ]"
          >
            <div class="flex items-center space-x-3">
              <component
                :is="item.icon"
                :class="[
                  'w-5 h-5 transition-colors',
                  route.path === item.path ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                ]"
              />
              <span>{{ item.name }}</span>
            </div>

            <span
              :class="[
                'text-[10px] px-2 py-0.5 font-bold border',
                route.path === item.path
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              ]"
            >
              {{ item.badge }}
            </span>
          </button>
        </div>
      </div>

      <!-- Bottom Container -->
      <div class="p-4 space-y-3 border-t border-slate-100 bg-slate-50/50">
        <!-- System Diagnostic Widget -->
        <div class="p-3.5 bg-white border border-slate-200 text-xs shadow-sm">
          <div class="flex items-center justify-between text-slate-800 font-bold mb-2">
            <span class="flex items-center gap-1.5 text-emerald-800">
              <Server class="w-3.5 h-3.5 text-emerald-600" />
              Credicord Core
            </span>
            <span class="w-2 h-2 bg-emerald-500 animate-pulse"></span>
          </div>
          <div class="space-y-1 text-slate-500 text-[11px]">
            <div class="flex justify-between">
              <span>Base de datos:</span>
              <span class="text-slate-800 font-semibold font-mono">PostgreSQL</span>
            </div>
            <div class="flex justify-between">
              <span>Seguridad:</span>
              <span class="text-amber-700 font-semibold flex items-center gap-0.5">
                <ShieldCheck class="w-3 h-3 text-amber-500" /> AES + JWT
              </span>
            </div>
            <div class="flex justify-between">
              <span>Versión:</span>
              <span class="text-emerald-700 font-bold font-mono">v1.2 Gold</span>
            </div>
          </div>
        </div>

        <!-- Logout Action Button -->
        <button
          @click="logout"
          class="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-sm"
        >
          <LogOut class="w-4 h-4 text-rose-600" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  </div>
</template>
