<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { metricsApi } from '../api/metrics.api';
import { DashboardMetrics, AuditLog } from '../types';
import StatCard from '../components/StatCard.vue';
import Badge from '../components/Badge.vue';
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
  RefreshCw,
  ExternalLink,
  Lock,
  Wallet,
  Building2,
  PieChart,
  ShieldCheck,
  Award
} from 'lucide-vue-next';

const router = useRouter();
const metrics = ref<DashboardMetrics | null>(null);
const activities = ref<AuditLog[]>([]);
const isLoading = ref<boolean>(true);
const isRefreshing = ref<boolean>(false);

const loadDashboardData = async () => {
  try {
    const [metricsRes, activityRes] = await Promise.all([
      metricsApi.getMetrics(),
      metricsApi.getRecentActivity(6),
    ]);
    metrics.value = metricsRes.data;
    activities.value = activityRes.data;
  } catch (error) {
    console.error('Error al cargar métricas:', error);
  } finally {
    isLoading.value = false;
    isRefreshing.value = false;
  }
};

const handleRefresh = async () => {
  isRefreshing.value = true;
  await loadDashboardData();
};

onMounted(() => {
  loadDashboardData();
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val || 0);
};

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};
</script>

<template>
  <div class="space-y-8">
    <!-- Top Header Banner with Emerald & Gold Accent -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white border border-slate-200 shadow-sm relative overflow-hidden">
      <!-- Subtle top gold border highlight -->
      <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-emerald-700"></div>

      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
            DevPanel Central
          </span>
          <span class="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 border border-amber-300 flex items-center gap-1">
            <Award class="w-3 h-3 text-amber-600" /> Monitoreo Gold
          </span>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
          Métricas y Posición Financiera
        </h1>
        <p class="text-xs text-slate-500 mt-0.5 font-medium">
          Balance consolidado de usuarios, productos financieros y eventos de auditoría en Credicord Bank.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="handleRefresh"
          :disabled="isRefreshing"
          class="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
        >
          <RefreshCw :class="['w-3.5 h-3.5 text-emerald-600', isRefreshing ? 'animate-spin' : '']" />
          <span>{{ isRefreshing ? 'Actualizando...' : 'Refrescar Datos' }}</span>
        </button>

        <button
          @click="router.push('/users')"
          class="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all"
        >
          <Users class="w-3.5 h-3.5" />
          <span>Directorio de Clientes</span>
        </button>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="i in 4" :key="i" class="bank-card p-6 h-36 animate-pulse bg-slate-100"></div>
    </div>

    <!-- Metrics Cards Grid -->
    <div v-else-if="metrics" class="space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- 1. Total Balance USD (Gold highlight) -->
        <StatCard
          title="Saldo en Custodia"
          :value="formatCurrency(metrics.accounts.totalBalanceUSD)"
          subtitle="Fondos administrados USD"
          trend="+12.4% este mes"
          :trendUp="true"
          colorScheme="gold"
        >
          <template #icon>
            <DollarSign class="w-5 h-5 text-amber-600" />
          </template>
        </StatCard>

        <!-- 2. Total Accounts (Emerald highlight) -->
        <StatCard
          title="Cuentas Bancarias"
          :value="metrics.accounts.total"
          :subtitle="`${metrics.accounts.active} activas · ${metrics.accounts.frozen} retenidas`"
          trend="98.2% operativas"
          :trendUp="true"
          colorScheme="emerald"
        >
          <template #icon>
            <CreditCard class="w-5 h-5 text-emerald-700" />
          </template>
        </StatCard>

        <!-- 3. Total Users (Blue highlight) -->
        <StatCard
          title="Usuarios Registrados"
          :value="metrics.users.total"
          :subtitle="`${metrics.users.active} activos · ${metrics.users.inactive} inactivos`"
          trend="Verificados"
          :trendUp="true"
          colorScheme="purple"
        >
          <template #icon>
            <Users class="w-5 h-5 text-purple-700" />
          </template>
        </StatCard>

        <!-- 4. Recent Signups (Emerald highlight) -->
        <StatCard
          title="Nuevos Clientes (30d)"
          :value="metrics.users.recentSignups"
          subtitle="Aperturas en el periodo"
          trend="Crecimiento activo"
          :trendUp="true"
          colorScheme="emerald"
        >
          <template #icon>
            <TrendingUp class="w-5 h-5 text-emerald-700" />
          </template>
        </StatCard>
      </div>

      <!-- Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Distribution & Diagnostics -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Breakdown of Accounts by Type in White Card -->
          <div class="bank-card p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <PieChart class="w-4 h-4 text-emerald-700" />
                  Distribución de Cartera por Tipo de Cuenta
                </h3>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">
                  Segmentación del portafolio de productos financieros en Credicord Bank
                </p>
              </div>
              <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 border border-slate-200">
                {{ metrics.accounts.total }} cuentas totales
              </span>
            </div>

            <div class="space-y-5">
              <!-- Cuentas Corrientes -->
              <div>
                <div class="flex justify-between text-xs mb-1.5 font-semibold">
                  <span class="text-slate-700 flex items-center gap-2">
                    <Building2 class="w-4 h-4 text-blue-600" /> Cuentas Corrientes
                  </span>
                  <span class="text-slate-900 font-mono">
                    {{ metrics.accounts.byType.checking }} cuentas ({{ Math.round((metrics.accounts.byType.checking / (metrics.accounts.total || 1)) * 100) }}%)
                  </span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 overflow-hidden">
                  <div
                    class="h-full bg-blue-600 transition-all duration-500"
                    :style="{ width: `${(metrics.accounts.byType.checking / (metrics.accounts.total || 1)) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Cuentas de Ahorros -->
              <div>
                <div class="flex justify-between text-xs mb-1.5 font-semibold">
                  <span class="text-slate-700 flex items-center gap-2">
                    <Wallet class="w-4 h-4 text-emerald-600" /> Cuentas de Ahorros
                  </span>
                  <span class="text-slate-900 font-mono">
                    {{ metrics.accounts.byType.savings }} cuentas ({{ Math.round((metrics.accounts.byType.savings / (metrics.accounts.total || 1)) * 100) }}%)
                  </span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 overflow-hidden">
                  <div
                    class="h-full bg-emerald-600 transition-all duration-500"
                    :style="{ width: `${(metrics.accounts.byType.savings / (metrics.accounts.total || 1)) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Fondos de Inversión (Gold Touch) -->
              <div>
                <div class="flex justify-between text-xs mb-1.5 font-semibold">
                  <span class="text-slate-700 flex items-center gap-2">
                    <TrendingUp class="w-4 h-4 text-amber-500" /> Fondos de Inversión (Gold Tier)
                  </span>
                  <span class="text-slate-900 font-mono">
                    {{ metrics.accounts.byType.investment }} cuentas ({{ Math.round((metrics.accounts.byType.investment / (metrics.accounts.total || 1)) * 100) }}%)
                  </span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 overflow-hidden">
                  <div
                    class="h-full bg-amber-500 transition-all duration-500"
                    :style="{ width: `${(metrics.accounts.byType.investment / (metrics.accounts.total || 1)) * 100}%` }"
                  ></div>
                </div>
              </div>

              <!-- Líneas de Crédito -->
              <div>
                <div class="flex justify-between text-xs mb-1.5 font-semibold">
                  <span class="text-slate-700 flex items-center gap-2">
                    <CreditCard class="w-4 h-4 text-indigo-600" /> Líneas de Crédito Corporativas
                  </span>
                  <span class="text-slate-900 font-mono">
                    {{ metrics.accounts.byType.credit }} cuentas ({{ Math.round((metrics.accounts.byType.credit / (metrics.accounts.total || 1)) * 100) }}%)
                  </span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 overflow-hidden">
                  <div
                    class="h-full bg-indigo-600 transition-all duration-500"
                    :style="{ width: `${(metrics.accounts.byType.credit / (metrics.accounts.total || 1)) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Architecture & Security Health -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-5 bg-white border border-slate-200 shadow-sm">
              <div class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Base de Datos</div>
              <div class="mt-2 text-sm font-bold text-slate-800 flex items-center gap-2">
                <span class="w-2.5 h-2.5 bg-emerald-500"></span>
                PostgreSQL 16
              </div>
              <div class="text-xs text-slate-500 mt-1 font-medium">Prisma ORM sincronizado</div>
            </div>

            <div class="p-5 bg-white border border-slate-200 shadow-sm">
              <div class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Cifrado & Autenticación</div>
              <div class="mt-2 text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                <Lock class="w-4 h-4 text-emerald-600" />
                JWT + Bcrypt
              </div>
              <div class="text-xs text-slate-500 mt-1 font-medium">Tokens con caducidad 2h</div>
            </div>

            <div class="p-5 bg-white border border-slate-200 shadow-sm">
              <div class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Tiempo de Actividad</div>
              <div class="mt-2 text-sm font-bold text-slate-900 font-mono">
                {{ Math.floor(metrics.systemStatus.uptimeSeconds / 60) }}m {{ metrics.systemStatus.uptimeSeconds % 60 }}s
              </div>
              <div class="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5" /> Core 100% Estable
              </div>
            </div>
          </div>
        </div>

        <!-- Right 1 Col: Audit Log Feed -->
        <div class="bank-card p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Activity class="w-4 h-4 text-emerald-700" />
                Bitácora de Auditoría
              </h3>
              <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Oficial
              </span>
            </div>
            <p class="text-xs text-slate-500 mb-4 font-medium">
              Eventos administrativos registrados cronológicamente.
            </p>

            <div class="space-y-3">
              <div
                v-for="log in activities"
                :key="log.id"
                class="p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-mono font-bold text-emerald-800 text-[11px]">
                    {{ log.action }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">
                    {{ formatTimeAgo(log.createdAt) }}
                  </span>
                </div>
                <div class="text-xs text-slate-700 mt-1 font-medium leading-snug">
                  {{ log.details || 'Acción registrada por el sistema' }}
                </div>
                <div v-if="log.user" class="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span class="font-semibold text-slate-800">{{ log.user.firstName }} {{ log.user.lastName }}</span>
                  <span>·</span>
                  <Badge type="role" :value="log.user.role" />
                </div>
              </div>
            </div>
          </div>

          <button
            @click="router.push('/users')"
            class="w-full mt-6 py-3 px-4 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold border border-slate-200 hover:border-emerald-300 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>Ver Directorio Completo de Clientes</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
