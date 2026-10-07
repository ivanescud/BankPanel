import { ref, watch, Ref } from 'vue';

export function useDebounce<T>(source: Ref<T>, delay = 350): Ref<T> {
  const debounced = ref(source.value) as Ref<T>;
  let timeoutId: any = null;

  watch(source, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      debounced.value = newValue;
    }, delay);
  });

  return debounced;
}
