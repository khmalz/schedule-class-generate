<template>
  <div>
    <button
      @click="$emit('click')"
      type="button"
      class="text-white text-lg sm:text-xl md:text-2xl bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700 font-medium rounded-lg px-7 py-3 me-2 mb-2 select-none"
    >
      Generate Schedule
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(["click"]);
</script>
