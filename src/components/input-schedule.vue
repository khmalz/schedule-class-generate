<template>
  <div class="flex flex-col justify-center items-center mt-10">
    <div id="text-input" class="max-w-4xl mx-auto w-full mb-8">
      <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Input Here</label
      >
      <textarea
        v-model="model"
        id="input-schedule"
        rows="4"
        class="block p-2.5 w-full text-sm text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-800 focus:border-cyan-800 placeholder:text-slate-400"
        placeholder="Write your schedule here..."
      ></textarea>
    </div>

    <button
      @click="$emit('click')"
      type="button"
      class="text-white text-sm bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-700 font-medium rounded-lg px-7 py-3 me-2 mb-2 select-none"
    >
      Generate
    </button>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: "" });

defineEmits(["click"]);
</script>

<style scoped></style>
