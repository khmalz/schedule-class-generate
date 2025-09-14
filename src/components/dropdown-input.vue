<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps<{
  options: { label: string; value: string }[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const selected = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue);
  return found ? found.label : "Select...";
});

function selectOption(option: { label: string; value: string }) {
  emit("update:modelValue", option.value);
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <button
      @click="isOpen = !isOpen"
      class="inline-flex w-30 md:w-36 justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-xs md:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
    >
      {{ selected }}
      <svg
        class="ml-2 h-4 w-4 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-10 mt-2 w-30 md:w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1">
        <button
          v-for="option in props.options"
          :key="option.value"
          @click="selectOption(option)"
          class="block w-full px-4 py-2 text-left text-xs md:text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>
