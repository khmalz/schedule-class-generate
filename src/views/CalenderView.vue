<template>
  <div>
    <button @click="generateImage" class="mb-4 bg-green-500 text-white px-4 py-2 rounded">
      Generate Preview
    </button>

    <div v-if="imageSrc" class="mb-4">
      <h3 class="text-white mb-2">Preview:</h3>
      <img :src="imageSrc" class="border rounded w-3xl" />
      <button @click="downloadImage" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Download Image
      </button>
    </div>

    <div ref="imageTarget" class="fixed left-[200vw] top-0 p-4 bg-cyan-950 rounded shadow z-[-1]">
      <schedule-view key="3" :schedule="schedule" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import html2canvas from "html2canvas-pro";
import ScheduleView from "./ScheduleView.vue";

const schedule = ref({
  Senin: [
    {
      subject: "Matematika",
      time: "10.00-11.40",
      desc: "Ruang 101",
    },
  ],
});

const imageTarget = ref(null);
const imageSrc = ref<string | null>(null);

async function generateImage() {
  const element = imageTarget.value;
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  imageSrc.value = canvas.toDataURL("image/png");
}

function downloadImage() {
  if (!imageSrc.value) return;
  const link = document.createElement("a");
  link.href = imageSrc.value;
  link.download = "schedule-preview.png";
  link.click();
}
</script>
