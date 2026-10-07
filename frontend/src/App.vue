<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from './composables/useAuth';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const { checkAuth } = useAuth();
const sidebarOpen = ref(false);

const isAuthPage = computed(() => {
  return route.name === 'Login';
});

onMounted(async () => {
  await checkAuth();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
    <!-- Unauthenticated Login Screen -->
    <div v-if="isAuthPage" class="flex-1 bg-white">
      <router-view />
    </div>

    <!-- Authenticated Layout -->
    <div v-else class="flex flex-1 min-h-screen bg-slate-50">
      <!-- Fixed / Collapsible Sidebar -->
      <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main Layout Body (Padded left on lg screens for sidebar) -->
      <div class="flex-1 flex flex-col min-w-0 lg:pl-64 bg-slate-50">
        <!-- Top Navbar -->
        <Navbar
          :sidebarOpen="sidebarOpen"
          @toggleSidebar="sidebarOpen = !sidebarOpen"
        />

        <!-- Main Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-slate-50">
          <router-view />
        </main>

        <!-- Footer -->
        <footer class="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white shadow-sm">
          Credicorp Bank Core DevPanel &copy; 2025. Todos los derechos reservados. Sistema con cifrado institucional AES-256.
        </footer>
      </div>
    </div>
  </div>
</template>
