<template>
  <div class="flex mt-5 w-full">
    <div id="text-input" class="mx-auto w-full mb-8">
      <textarea
        v-model="model"
        id="input-schedule"
        rows="6"
        class="block p-2.5 w-full text-sm md:text-base text-cyan-900 bg-white rounded-lg border border-gray-300 focus:ring-cyan-800 focus:border-cyan-800 placeholder:text-slate-400"
        placeholder="Input your schedule here..."
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: "" });
</script>

<style scoped></style>
