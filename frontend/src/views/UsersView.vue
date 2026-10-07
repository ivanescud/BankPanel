<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { usersApi } from '../api/users.api';
import { User } from '../types';
import { useDebounce } from '../composables/useDebounce';
import Badge from '../components/Badge.vue';
import Pagination from '../components/Pagination.vue';
import UserDetailsModal from '../components/UserDetailsModal.vue';
import {
  Search,
  Eye,
  CreditCard,
  RefreshCw,
  AlertCircle,
  XCircle,
  Award
} from 'lucide-vue-next';

// State
const users = ref<User[]>([]);
const totalUsers = ref<number>(0);
const page = ref<number>(1);
const limit = ref<number>(10);
const totalPages = ref<number>(1);
const hasNextPage = ref<boolean>(false);
const hasPrevPage = ref<boolean>(false);
const isLoading = ref<boolean>(false);

// Search & Filter State
const searchInput = ref<string>('');
const debouncedSearch = useDebounce(searchInput, 400); // 400ms debounce
const selectedRole = ref<string>('ALL');
const selectedStatus = ref<string>('ALL');

// Modal State
const selectedUser = ref<User | null>(null);
const isModalOpen = ref<boolean>(false);

// Fetch users from API
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await usersApi.getUsers({
      page: page.value,
      limit: limit.value,
      search: debouncedSearch.value || undefined,
      role: selectedRole.value !== 'ALL' ? selectedRole.value : undefined,
      status: selectedStatus.value !== 'ALL' ? selectedStatus.value : undefined,
    });

    users.value = res.data;
    totalUsers.value = res.pagination.total;
    totalPages.value = res.pagination.totalPages;
    hasNextPage.value = res.pagination.hasNextPage;
    hasPrevPage.value = res.pagination.hasPrevPage;
  } catch (error) {
    console.error('Error al consultar usuarios:', error);
  } finally {
    isLoading.value = false;
  }
};

// React to debounced search changes -> reset to page 1 & fetch
watch(debouncedSearch, () => {
  page.value = 1;
  fetchUsers();
});

// React to role and status filter changes
watch([selectedRole, selectedStatus], () => {
  page.value = 1;
  fetchUsers();
});

// React to page or limit changes
const handlePageChange = (newPage: number) => {
  page.value = newPage;
  fetchUsers();
};

const handleLimitChange = (newLimit: number) => {
  limit.value = newLimit;
  page.value = 1;
  fetchUsers();
};

const clearSearch = () => {
  searchInput.value = '';
};

// Modal handlers
const openUserDetails = (user: User) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const closeUserDetails = () => {
  isModalOpen.value = false;
  selectedUser.value = null;
};

onMounted(() => {
  fetchUsers();
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0);
};

const getUserTotalBalance = (user: User) => {
  if (!user.accounts || user.accounts.length === 0) return 0;
  return user.accounts.reduce((acc, curr) => acc + curr.balance, 0);
};

const formatDate = (iso: string) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header Banner in White with Emerald / Gold Details -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
      <!-- Top Gold Line -->
      <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700"></div>

      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
            Directorio Oficial
          </span>
          <span class="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 border border-amber-300 flex items-center gap-1">
            <Award class="w-3 h-3 text-amber-600" /> {{ totalUsers }} Registros Verificados
          </span>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
          Directorio de Clientes y Cuentas
        </h1>
        <p class="text-xs text-slate-500 mt-0.5 font-medium">
          Búsqueda reactiva con debounce de 400ms, filtros segmentados y desglose de cuentas asociadas.
        </p>
      </div>

      <button
        @click="fetchUsers"
        :disabled="isLoading"
        class="self-start sm:self-auto flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
      >
        <RefreshCw :class="['w-3.5 h-3.5 text-emerald-600', isLoading ? 'animate-spin' : '']" />
        <span>Actualizar Datos</span>
      </button>
    </div>

    <!-- Filters & Debounce Search Bar in White Card -->
    <div class="bank-card p-4 flex flex-col md:flex-row items-center gap-4">
      <!-- Search Input with Debounce Indicator -->
      <div class="relative flex-1 w-full">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchInput"
          type="text"
          placeholder="Buscar por nombre, apellido, correo electrónico o N° de cuenta..."
          class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
        />
        <button
          v-if="searchInput"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <XCircle class="w-4 h-4" />
        </button>
      </div>

      <!-- Filters Dropdowns -->
      <div class="flex items-center space-x-3 w-full md:w-auto">
        <!-- Role Filter -->
        <div class="flex items-center space-x-2 flex-1 md:flex-initial">
          <label for="role-filter" class="text-xs text-slate-500 font-semibold whitespace-nowrap">Rol:</label>
          <select
            id="role-filter"
            v-model="selectedRole"
            class="bg-white text-slate-800 border border-slate-200 text-xs px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none w-full md:w-36 font-medium shadow-sm"
          >
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Admin</option>
            <option value="DEVELOPER">Developer</option>
            <option value="AUDITOR">Auditor</option>
            <option value="USER">Cliente</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="flex items-center space-x-2 flex-1 md:flex-initial">
          <label for="status-filter" class="text-xs text-slate-500 font-semibold whitespace-nowrap">Estado:</label>
          <select
            id="status-filter"
            v-model="selectedStatus"
            class="bg-white text-slate-800 border border-slate-200 text-xs px-3 py-2.5 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none w-full md:w-36 font-medium shadow-sm"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="SUSPENDED">Suspendido</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table Container in White Card -->
    <div class="bank-card overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-slate-50/80 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-6 py-4">Usuario</th>
              <th scope="col" class="px-6 py-4">Rol</th>
              <th scope="col" class="px-6 py-4">Estado</th>
              <th scope="col" class="px-6 py-4">Cuentas Bancarias</th>
              <th scope="col" class="px-6 py-4 text-right">Saldo Custodia</th>
              <th scope="col" class="px-6 py-4">Registro</th>
              <th scope="col" class="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <!-- Loading Row -->
            <tr v-if="isLoading && users.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <div class="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-xs font-semibold text-slate-600">Consultando registros del Core...</span>
                </div>
              </td>
            </tr>

            <!-- Empty Search Results -->
            <tr v-else-if="users.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-500">
                <div class="flex flex-col items-center justify-center space-y-2">
                  <AlertCircle class="w-8 h-8 text-slate-400" />
                  <p class="text-sm font-bold text-slate-800">No se encontraron clientes</p>
                  <p class="text-xs text-slate-500">
                    Modifica los parámetros de búsqueda o los filtros aplicados.
                  </p>
                </div>
              </td>
            </tr>

            <!-- User Rows -->
            <tr
              v-for="u in users"
              :key="u.id"
              class="hover:bg-emerald-50/40 transition-colors group"
            >
              <!-- Name & Email -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-3">
                  <img
                    :src="u.avatar || `https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=046A38&color=fff`"
                    class="w-10 h-10 object-cover border border-slate-200 shadow-sm group-hover:border-emerald-300"
                    alt="User"
                  />
                  <div>
                    <div class="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {{ u.firstName }} {{ u.lastName }}
                    </div>
                    <div class="text-slate-500 text-xs font-mono">
                      {{ u.email }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge type="role" :value="u.role" />
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge type="status" :value="u.status" />
              </td>

              <!-- Accounts -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="u.accounts && u.accounts.length > 0" class="flex flex-col">
                  <span class="font-mono text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <CreditCard class="w-3.5 h-3.5 text-emerald-600" />
                    {{ u.accounts[0].accountNumber }}
                  </span>
                  <span v-if="u.accounts.length > 1" class="text-[11px] text-slate-400 font-medium">
                    +{{ u.accounts.length - 1 }} cuenta(s) adicional(es)
                  </span>
                </div>
                <span v-else class="text-slate-400 text-xs italic">
                  Sin cuentas registradas
                </span>
              </td>

              <!-- Balance USD -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="font-mono font-extrabold text-emerald-700 text-xs sm:text-sm">
                  {{ formatCurrency(getUserTotalBalance(u)) }}
                </span>
              </td>

              <!-- Registered Date -->
              <td class="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-medium">
                {{ formatDate(u.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button
                  @click="openUserDetails(u)"
                  title="Examinar cuentas de este cliente"
                  class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-sm"
                >
                  <Eye class="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cuentas</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="border-t border-slate-200 bg-white">
        <Pagination
          :page="page"
          :totalPages="totalPages"
          :total="totalUsers"
          :limit="limit"
          :hasNextPage="hasNextPage"
          :hasPrevPage="hasPrevPage"
          @update:page="handlePageChange"
          @update:limit="handleLimitChange"
        />
      </div>
    </div>

    <!-- User Details Modal -->
    <UserDetailsModal
      :isOpen="isModalOpen"
      :user="selectedUser"
      @close="closeUserDetails"
    />
  </div>
</template>
