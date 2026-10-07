<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

const props = defineProps<{
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
  (e: 'update:limit', limit: number): void;
}>();

const startItem = computed(() => {
  if (props.total === 0) return 0;
  return (props.page - 1) * props.limit + 1;
});

const endItem = computed(() => {
  return Math.min(props.page * props.limit, props.total);
});

// Generate dynamic pagination window
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxButtons = 5;
  let start = Math.max(1, props.page - Math.floor(maxButtons / 2));
  let end = Math.min(props.totalPages, start + maxButtons - 1);

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 text-xs text-slate-600 bg-white">
    <!-- Counter & Limit Selector -->
    <div class="flex items-center space-x-3">
      <span>
        Mostrando <strong class="text-slate-900 font-bold">{{ startItem }}</strong> a
        <strong class="text-slate-900 font-bold">{{ endItem }}</strong> de
        <strong class="text-slate-900 font-bold">{{ total }}</strong> registros
      </span>

      <div class="flex items-center space-x-1 pl-3 border-l border-slate-200">
        <label for="limit-select" class="text-xs text-slate-500 font-medium">Por pág:</label>
        <select
          id="limit-select"
          :value="limit"
          @change="emit('update:limit', Number(($event.target as HTMLSelectElement).value))"
          class="bg-white text-slate-800 border border-slate-200 text-xs px-2 py-1 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none shadow-sm font-medium"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Navigation Controls -->
    <div class="flex items-center space-x-1">
      <!-- First Page -->
      <button
        @click="emit('update:page', 1)"
        :disabled="page === 1"
        title="Primera página"
        class="p-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronsLeft class="w-4 h-4" />
      </button>

      <!-- Prev -->
      <button
        @click="emit('update:page', page - 1)"
        :disabled="!hasPrevPage"
        title="Página anterior"
        class="p-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center space-x-1 px-1">
        <button
          v-for="p in visiblePages"
          :key="p"
          @click="emit('update:page', p)"
          :class="[
            'w-8 h-8 text-xs font-bold transition-all shadow-sm',
            p === page
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          {{ p }}
        </button>
      </div>

      <!-- Next -->
      <button
        @click="emit('update:page', page + 1)"
        :disabled="!hasNextPage"
        title="Página siguiente"
        class="p-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronRight class="w-4 h-4" />
      </button>

      <!-- Last Page -->
      <button
        @click="emit('update:page', totalPages)"
        :disabled="page === totalPages || totalPages === 0"
        title="Última página"
        class="p-2 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronsRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
