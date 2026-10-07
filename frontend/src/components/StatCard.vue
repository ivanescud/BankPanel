<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  colorScheme?: 'emerald' | 'gold' | 'blue' | 'purple';
}>();
</script>

<template>
  <div class="bank-card bank-card-hover p-6 relative overflow-hidden group">
    <!-- Subtle Top Color Accent Bar -->
    <div
      :class="[
        'absolute top-0 inset-x-0 h-1',
        colorScheme === 'gold' ? 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500' :
        colorScheme === 'blue' ? 'bg-blue-600' :
        colorScheme === 'purple' ? 'bg-purple-600' : 'bg-gradient-to-r from-emerald-600 to-emerald-800'
      ]"
    ></div>

    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-bold tracking-wider uppercase text-slate-500">
        {{ title }}
      </span>
      <div
        :class="[
          'w-10 h-10 flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105',
          colorScheme === 'gold' ? 'bg-amber-50 border-amber-200 text-amber-700' :
          colorScheme === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' :
          colorScheme === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        ]"
      >
        <slot name="icon">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </slot>
      </div>
    </div>

    <div class="flex items-baseline space-x-2">
      <div class="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
        {{ value }}
      </div>
    </div>

    <div v-if="subtitle || trend" class="mt-3 flex items-center text-xs text-slate-500 justify-between">
      <span v-if="subtitle" class="font-medium truncate">{{ subtitle }}</span>
      <span
        v-if="trend"
        :class="[
          'inline-flex items-center font-bold px-2 py-0.5 border text-[11px] shrink-0',
          trendUp ? 'text-emerald-800 bg-emerald-50 border-emerald-200' : 'text-slate-600 bg-slate-100 border-slate-200'
        ]"
      >
        <svg v-if="trendUp" class="w-3 h-3 mr-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {{ trend }}
      </span>
    </div>
  </div>
</template>
