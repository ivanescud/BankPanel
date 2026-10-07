<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ShieldAlert, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
</script>

<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
    <div class="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
      <ShieldAlert class="w-8 h-8" />
    </div>
    <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
    <h2 class="text-lg font-bold text-slate-800 mt-2">Página o recurso no encontrado</h2>
    <p class="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
      La dirección a la que intentas acceder no existe en el sistema de Credicord Bank DevPanel.
    </p>

    <button
      @click="router.push('/dashboard')"
      class="mt-6 flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 shadow-sm transition-all"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Volver al Dashboard</span>
    </button>
  </div>
</template>
