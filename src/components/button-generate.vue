<template>
  <div>
    <button
      @click="$emit('click')"
      type="button"
      class="text-white text-sm sm:text-base md:text-lg lg:text-xl bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-700 font-medium rounded-lg px-5 md:px-7 py-3 mb-2 select-none"
    >
      Generate Schedule
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(["click"]);
</script>
