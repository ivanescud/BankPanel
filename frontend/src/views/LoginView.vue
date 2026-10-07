<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import CredicordLogo from '../components/CredicordLogo.vue';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award
} from 'lucide-vue-next';

const route = useRoute();
const { login, isLoading, authError, sessionExpiredNotification, clearErrors } = useAuth();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const urlExpiredMessage = ref<string | null>(null);

onMounted(() => {
  clearErrors();
  if (route.query.expired === '1') {
    urlExpiredMessage.value = 'Tu sesión ha expirado por inactividad o caducidad del token. Por favor inicia sesión nuevamente.';
  } else if (route.query.unauthorized === '1') {
    urlExpiredMessage.value = 'Debes iniciar sesión con credenciales válidas para ingresar al panel.';
  }
});

const handleSubmit = async () => {
  urlExpiredMessage.value = null;
  if (!email.value || !password.value) return;
  await login({ email: email.value, password: password.value });
};

// 1-Click Demo Account Autofill
const fillDemo = (role: 'admin' | 'dev' | 'auditor') => {
  clearErrors();
  urlExpiredMessage.value = null;
  if (role === 'admin') {
    email.value = 'admin@credicordbank.com';
    password.value = 'Credicord2025!';
  } else if (role === 'dev') {
    email.value = 'dev@credicordbank.com';
    password.value = 'Credicord2025!';
  } else {
    email.value = 'auditor@credicordbank.com';
    password.value = 'Credicord2025!';
  }
};
</script>

<template>
  <div class="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">
    <!-- LEFT SIDE: 70% PROPORTION (Hero Banking Image & Financial Tech Branding) -->
    <div class="relative hidden lg:flex lg:w-[70%] xl:w-[70%] bg-emerald-950 overflow-hidden flex-col justify-between p-12 text-white">
      <!-- Background Generated Image -->
      <img
        src="/images/credicord_hero.jpg"
        alt="Credicord Bank Modern Headquarters"
        class="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
      />

      <!-- Multi-Layer Gradient Overlays for High Contrast and Sophistication -->
      <div class="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-slate-950/50 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40"></div>

      <!-- Top Branding Pill on Image -->
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20">
          <div class="w-2.5 h-2.5 bg-emerald-400 animate-pulse"></div>
          <span class="text-xs font-semibold tracking-wider uppercase text-white">
            Core Bancario Central · Operativo
          </span>
        </div>

        <div class="flex items-center space-x-2 text-xs font-medium text-amber-300 bg-amber-500/10 px-3.5 py-1.5 border border-amber-400/30 backdrop-blur-md">
          <Award class="w-4 h-4 text-amber-400" />
          <span>Banca Corporativa & Custodia VIP</span>
        </div>
      </div>

      <!-- Bottom Headline & Statistics Showcase -->
      <div class="relative z-10 space-y-6 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
          <ShieldCheck class="w-4 h-4 text-emerald-400" />
          Infraestructura Financiera Segura
        </div>

        <h1 class="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Potencia, control y precisión en la gestión bancaria moderna.
        </h1>

        <p class="text-base text-slate-200/90 leading-relaxed font-normal max-w-2xl">
          El DevPanel de Credicord Bank centraliza el monitoreo de liquidez, auditoría en tiempo real y directorio integral de clientes corporativos con seguridad de grado institucional.
        </p>

        <!-- Live Statistics Badges -->
        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
          <div class="p-4 bg-white/10 backdrop-blur-md border border-white/10">
            <div class="text-2xl font-black text-white font-mono">$3.12M+</div>
            <div class="text-xs text-emerald-300 font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp class="w-3.5 h-3.5 text-emerald-400" /> Fondos en Custodia
            </div>
          </div>

          <div class="p-4 bg-white/10 backdrop-blur-md border border-white/10">
            <div class="text-2xl font-black text-white font-mono">99.99%</div>
            <div class="text-xs text-amber-300 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-amber-400" /> Disponibilidad Core
            </div>
          </div>

          <div class="p-4 bg-white/10 backdrop-blur-md border border-white/10">
            <div class="text-2xl font-black text-white font-mono">100%</div>
            <div class="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" /> Auditoría Transaccional
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT SIDE: 30% PROPORTION (Clean White Login Panel) -->
    <div class="w-full lg:w-[30%] xl:w-[30%] min-h-screen bg-white flex flex-col justify-between p-8 sm:p-12 z-10 border-l border-slate-100 shadow-2xl lg:shadow-none">
      <!-- Top: Bank Logo -->
      <div class="pt-2">
        <CredicordLogo size="lg" :showBadge="true" />
      </div>

      <!-- Center: Login Form -->
      <div class="my-auto py-8">
        <div class="mb-8">
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Iniciar Sesión
          </h2>
          <p class="text-xs text-slate-500 mt-1.5 font-medium">
            Ingresa con tus credenciales de Credicord Bank para gestionar el DevPanel.
          </p>
        </div>

        <!-- Session Expiration Alert Banner -->
        <div
          v-if="urlExpiredMessage || sessionExpiredNotification"
          class="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-3 shadow-sm"
        >
          <AlertTriangle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div class="leading-relaxed">
            <strong class="font-bold text-amber-900 block">Sesión Finalizada</strong>
            {{ urlExpiredMessage || sessionExpiredNotification }}
          </div>
        </div>

        <!-- Auth Error Alert Banner -->
        <div
          v-if="authError"
          class="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-sm"
        >
          <AlertTriangle class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div class="leading-relaxed">
            <strong class="font-bold text-rose-900 block">Error de Acceso</strong>
            {{ authError }}
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Correo Institucional
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail class="w-4 h-4" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                placeholder="usuario@credicordbank.com"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Contraseña
              </label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all font-medium"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                tabindex="-1"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Submit Button in Emerald Green with Gold Accent Details -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-3 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 focus:outline-none focus:ring-2 focus:ring-emerald-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
          >
            <!-- Top Gold Edge Line Highlight -->
            <div class="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 opacity-70"></div>

            <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white/40 border-t-white animate-spin"></span>
            <span v-else class="flex items-center gap-2">
              Ingresar al DevPanel
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-300" />
            </span>
          </button>
        </form>

        <!-- 1-Click Demo Credentials Preset in White Box with Gold/Green Accents -->
        <div class="mt-8 pt-6 border-t border-slate-100">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Accesos Demo (1-Clic)
            </span>
            <span class="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              Pruebas Rápidas
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              @click="fillDemo('admin')"
              class="py-2.5 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span class="text-amber-500">👑</span>
              <span>Admin</span>
            </button>
            <button
              type="button"
              @click="fillDemo('dev')"
              class="py-2.5 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span class="text-emerald-600">💻</span>
              <span>Developer</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom: Security Footer -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Credicord Bank S.A. &copy; 2025</span>
        <span class="flex items-center gap-1 text-emerald-700 font-semibold">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" /> Cifrado AES-256
        </span>
      </div>
    </div>
  </div>
</template>
