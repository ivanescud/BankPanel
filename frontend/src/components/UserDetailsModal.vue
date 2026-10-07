<script setup lang="ts">
import { User } from '../types';
import Badge from './Badge.vue';
import { X, CreditCard, ShieldCheck, Mail, Calendar } from 'lucide-vue-next';

defineProps<{
  user: User | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val);
};

const formatDate = (iso: string) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <div
    v-if="isOpen && user"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity"
  >
    <div
      class="bg-white border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div class="flex items-center space-x-3">
          <img
            :src="user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=046A38&color=fff`"
            class="w-12 h-12 object-cover border-2 border-emerald-600/30 shadow-sm"
            alt="Avatar"
          />
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              {{ user.firstName }} {{ user.lastName }}
              <Badge type="role" :value="user.role" />
            </h3>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
              <Mail class="w-3.5 h-3.5 text-slate-400" />
              {{ user.email }}
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-6">
        <!-- Account Status & Metadata -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200">
          <div>
            <div class="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Estado del Cliente</div>
            <div class="mt-1">
              <Badge type="status" :value="user.status" />
            </div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500 uppercase tracking-wider font-bold">ID Institucional</div>
            <div class="mt-1 font-mono text-xs text-slate-700 font-semibold truncate" :title="user.id">
              {{ user.id }}
            </div>
          </div>
          <div>
            <div class="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Fecha de Registro</div>
            <div class="mt-1 text-xs text-slate-700 flex items-center gap-1 font-medium">
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              {{ formatDate(user.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Bank Accounts Section -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <CreditCard class="w-4 h-4 text-emerald-700" />
              Cuentas Bancarias Asociadas
            </h4>
            <span class="text-xs text-slate-500 font-medium">
              Total: {{ user.accounts?.length || 0 }} {{ user.accounts?.length === 1 ? 'cuenta' : 'cuentas' }}
            </span>
          </div>

          <div v-if="user.accounts && user.accounts.length > 0" class="space-y-3">
            <div
              v-for="acc in user.accounts"
              :key="acc.id"
              class="p-4 border border-slate-200 bg-white hover:border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-all"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm font-bold text-emerald-800 tracking-wider">
                    {{ acc.accountNumber }}
                  </span>
                  <Badge type="accountType" :value="acc.accountType" />
                  <Badge type="accountStatus" :value="acc.status" />
                </div>
                <div class="text-xs text-slate-500 mt-1">
                  Apertura: {{ formatDate(acc.createdAt) }}
                </div>
              </div>

              <div class="text-right">
                <div class="text-xs text-slate-500 font-medium">Saldo en Custodia</div>
                <div class="text-base font-extrabold text-emerald-700 font-mono">
                  {{ formatCurrency(acc.balance) }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="p-6 text-center border border-dashed border-slate-200 text-slate-500 text-sm bg-slate-50"
          >
            Este usuario no posee cuentas bancarias asociadas actualmente.
          </div>
        </div>

        <!-- Security Notice in Emerald/Gold -->
        <div class="p-4 bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <ShieldCheck class="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
          <div class="text-xs text-emerald-900 leading-relaxed font-medium">
            Todas las operaciones y consultas a las cuentas de clientes de Credicord Bank quedan registradas en el libro mayor de auditoría de cumplimiento financiero.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
        <button
          @click="emit('close')"
          class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors shadow-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>
