<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}>();
</script>

<template>
  <div class="flex items-center space-x-3 select-none">
    <img
      src="/images/logo3.png"
      alt="Credicorp Bank"
      :class="[
        'object-contain transition-all',
        size === 'sm' ? 'h-8 sm:h-9 max-w-[160px]' :
        size === 'lg' ? 'h-14 sm:h-16 max-w-[260px]' : 'h-10 sm:h-11 max-w-[210px]'
      ]"
    />

    <!-- DevPanel Badge with Forest Green & Gold Accent -->
    <span
      v-if="showBadge !== false"
      :class="[
        'inline-flex items-center font-black tracking-wider uppercase border',
        size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5',
        'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
      ]"
    >
      DevPanel
    </span>
  </div>
</template>
