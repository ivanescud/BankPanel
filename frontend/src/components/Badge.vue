<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: 'role' | 'status' | 'accountType' | 'accountStatus';
  value: string;
}>();

const badgeStyle = computed(() => {
  const v = props.value?.toUpperCase();

  // Roles
  if (props.type === 'role') {
    switch (v) {
      case 'ADMIN':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DEVELOPER':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      case 'AUDITOR':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  // User & Account Status
  if (props.type === 'status' || props.type === 'accountStatus') {
    switch (v) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      case 'INACTIVE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'SUSPENDED':
      case 'FROZEN':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
      case 'CLOSED':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  // Account Type
  if (props.type === 'accountType') {
    switch (v) {
      case 'CHECKING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SAVINGS':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium';
      case 'INVESTMENT':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      case 'CREDIT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }

  return 'bg-slate-100 text-slate-700 border-slate-200';
});

const label = computed(() => {
  const v = props.value?.toUpperCase();
  const map: Record<string, string> = {
    ADMIN: 'Admin',
    DEVELOPER: 'Developer',
    AUDITOR: 'Auditor',
    USER: 'Cliente',
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    SUSPENDED: 'Suspendido',
    FROZEN: 'Congelada',
    CLOSED: 'Cerrada',
    CHECKING: 'Corriente',
    SAVINGS: 'Ahorros',
    INVESTMENT: 'Inversión',
    CREDIT: 'Crédito',
  };
  return map[v] || props.value;
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 text-xs border tracking-wide transition-colors',
      badgeStyle
    ]"
  >
    <span
      v-if="['ACTIVE', 'INACTIVE', 'SUSPENDED', 'FROZEN'].includes(props.value?.toUpperCase())"
      :class="[
        'w-1.5 h-1.5 mr-1.5',
        props.value?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' :
        props.value?.toUpperCase() === 'SUSPENDED' || props.value?.toUpperCase() === 'FROZEN' ? 'bg-rose-500' : 'bg-slate-400'
      ]"
    ></span>
    {{ label }}
  </span>
</template>
