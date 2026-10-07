<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import CredicordLogo from './CredicordLogo.vue';
import Badge from './Badge.vue';
import { LogOut, Menu } from 'lucide-vue-next';

defineProps<{
  sidebarOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleSidebar'): void;
}>();

const { user, logout, isLoading } = useAuth();
</script>

<template>
  <header class="h-16 border-b border-slate-200 bg-white sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-sm">
    <!-- Left: Mobile menu toggle + Logo -->
    <div class="flex items-center space-x-4">
      <button
        @click="emit('toggleSidebar')"
        class="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Logo Display -->
      <CredicordLogo size="sm" :showBadge="true" />
    </div>

    <!-- Right: Status, User Details & Logout -->
    <div class="flex items-center space-x-4">
      <!-- Live Core Status Pill with Emerald & Gold Accent -->
      <div class="hidden md:flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-sm">
        <span class="w-2 h-2 bg-emerald-500 animate-pulse"></span>
        <span class="font-bold">Core Bancario Conectado</span>
      </div>

      <!-- User Card -->
      <div v-if="user" class="flex items-center space-x-3 pl-3 border-l border-slate-200">
        <div class="relative">
          <img
            :src="user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=046A38&color=fff`"
            class="w-9 h-9 object-cover border-2 border-emerald-600/30 shadow-sm"
            alt="User avatar"
          />
          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white"></span>
        </div>

        <div class="hidden sm:block text-left">
          <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            {{ user.firstName }} {{ user.lastName }}
            <Badge type="role" :value="user.role" />
          </div>
          <div class="text-[11px] text-slate-500 font-mono">
            {{ user.email }}
          </div>
        </div>

        <!-- Logout Action Button -->
        <button
          @click="logout"
          :disabled="isLoading"
          title="Cerrar sesión"
          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 border border-rose-200 transition-all shadow-sm"
        >
          <LogOut class="w-4 h-4 text-rose-600" />
          <span class="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  </header>
</template>
