<template>
  <div class="w-full flex justify-center mt-3">
    <div
      class="w-full"
      :style="{
        width: targetWidth ? `${targetWidth}px` : '100%',
        maxWidth: '100%',
      }"
    >
      <textarea
        v-model="model"
        id="input-schedule"
        class="block p-2.5 w-full text-sm xl:text-base text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-800 focus:border-cyan-800 placeholder:text-slate-400 placeholder:text-sm placeholder:xl:text-base"
        :style="{
          height: targetHeight ? `${targetHeight}px` : 'auto',
          minHeight: targetHeight ? `${Math.max(200, targetHeight)}px` : undefined,
        }"
        placeholder="Input your schedule here..."
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue?: string;
  targetWidth?: number;
  targetHeight?: number;
}>();

const model = defineModel<string>({ default: "" });
const targetWidth = computed(() => props.targetWidth);
const targetHeight = computed(() => props.targetHeight);
</script>

<style scoped></style>
