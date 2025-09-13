<template>
  <main class="py-8 max-w-4xl lg:max-w-7xl mx-auto w-full">
    <h1 class="text-center text-2xl md:text-3xl lg:text-4xl font-bold">
      Schedule Class Generate by Text
    </h1>

    <div class="flex gap-x-5 gap-y-5 md:gap-y-0 mt-5 flex-col md:flex-row">
      <div class="md:w-2/3 w-full">
        <h2 class="text-lg md:text-xl lg:text-2xl font-semibold text-white">
          Schedule Input Guide
        </h2>

        <div ref="guideBoxRef">
          <schedule-guide />
        </div>
      </div>
      <div class="md:w-1/3 w-full">
        <h2 class="text-lg md:text-xl lg:text-2xl font-semibold text-white">Input Here:</h2>
        <div class="hidden md:flex">
          <input-schedule-desktop v-model="input" :targetHeight="guideSize.height" />
        </div>
        <div class="md:hidden flex">
          <input-schedule-mobile v-model="input" />
        </div>
      </div>
    </div>

    <div class="flex mt-5 md:mt-10 items-center justify-center">
      <button-generate @click="generate" />
    </div>

    <div
      v-if="warningsStore.warnings.length"
      class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mt-6"
    >
      <h3 class="font-semibold mb-2 text-base md:text-lg">⚠️ Warning</h3>
      <ul class="list-disc pl-5 space-y-1 text-sm md:text-base">
        <li v-for="(warn, index) in warningsStore.warnings" :key="index">{{ warn }}</li>
      </ul>
    </div>

    <div v-if="loadingStore.isLoading" class="text-white mt-2">Rendering preview...</div>

    <div
      v-if="warningsStore.warnings.length === 0 && result && !loadingStore.isLoading"
      class="max-w-4xl md:max-w-6xl xl:max-w-7xl mx-auto p-4 bg-white rounded-2xl shadow-md border mt-5"
      id="result"
    >
      <div class="py-2 flex flex-col xl:gap-x-3 xl:gap-y-0 gap-y-2 items-center" v-if="imageSrc">
        <div>
          <div
            class="inline-block p-2 rounded"
            :style="{ backgroundColor: colorHex[selectedColor] }"
          >
            <img :src="imageSrc" class="border rounded w-3xl md:w-[40rem] lg:w-[65rem]" />
          </div>

          <div class="w-full mt-5 flex gap-x-3 justify-between">
            <button
              @click="downloadImage"
              class="bg-gray-700 hover:bg-gray-800 text-white rounded-lg border text-[10px] sm:text-sm lg:text-base px-3 sm:px-5 py-2 md:px-9 md:py-3"
            >
              Export Schedule
            </button>

            <div class="inline-flex justify-start items-center gap-x-3 sm:gap-x-4 md:gap-x-6">
              <button
                v-for="opt in colorOptions"
                :key="opt.name"
                :style="{ backgroundColor: opt.hex }"
                :class="[
                  'w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-10 lg:h-10 rounded-full border',
                  opt.border,
                  selectedColor === opt.name ? 'ring-2 md:ring-3 ring-cyan-500 ring-offset-2' : '',
                ]"
                @click="selectColor(opt.name)"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="result && selectedColor"
      :key="scheduleKey"
      class="fixed left-[200vw] top-0 p-4 rounded shadow z-[-1] bg-transparent"
      ref="imageTarget"
    >
      <schedule-view :key="scheduleKey" :schedule="result" :times="times" />
    </div>
  </main>
</template>

<script setup lang="ts">
import html2canvas from "html2canvas-pro";
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

import type { ScheduleMap } from "@/types/schedule";

import { colorHex, colorOptions } from "@/utils/color";
import ButtonGenerate from "@/components/button-generate.vue";
import InputScheduleDesktop from "@/components/input-schedule-desktop.vue";
import InputScheduleMobile from "@/components/input-schedule-mobile.vue";
import ScheduleGuide from "@/components/schedule-guide.vue";
import { scheduleParser } from "@/composable/scheduleParser";
import { useLoadingStore } from "@/stores/loading";
import { useScheduleStore } from "@/stores/schedule";
import { useWarningsStore } from "@/stores/warning";

import ScheduleView from "./ScheduleView.vue";

const guideBoxRef = ref<HTMLElement | null>(null);
const guideSize = reactive({ width: 0, height: 0 });
let ro: ResizeObserver | null = null;

function updateGuideSize() {
  const el = guideBoxRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  guideSize.width = Math.round(rect.width);
  guideSize.height = Math.round(rect.height);
}

onMounted(async () => {
  await nextTick();
  updateGuideSize();

  ro = new ResizeObserver(() => {
    updateGuideSize();
  });

  if (guideBoxRef.value) ro.observe(guideBoxRef.value);
  window.addEventListener("resize", updateGuideSize);
});

onBeforeUnmount(() => {
  if (ro && guideBoxRef.value) ro.unobserve(guideBoxRef.value);
  if (ro) ro.disconnect();
  window.removeEventListener("resize", updateGuideSize);
});

// -----------------------------------------------------------------------------------

const selectedColor = ref("cyan-950");
const selectColor = (colorName: string) => (selectedColor.value = colorName);

const input = ref<string>("");
const result = ref<ScheduleMap | null>(null);
const times = ref<{ min: number; max: number }>();
const scheduleKey = ref<number>(0);

const { generateSchedule, validateInput } = scheduleParser();
const loadingStore = useLoadingStore();
const warningsStore = useWarningsStore();
const scheduleStore = useScheduleStore();

const generate = async () => {
  scheduleStore.resetSchedule();

  const warnings = validateInput(input.value);
  warnings.forEach((warning) => warningsStore.addWarning(warning));

  if (warningsStore.warnings.length > 0) {
    result.value = null;
    return;
  }

  const [schedule, min, max] = generateSchedule(input.value);
  result.value = schedule;
  times.value = { min: min, max: max };

  scheduleKey.value++;

  await nextTick();
  await generateImage();
};

// --------------------------------------------------------------------------------

const imageTarget = ref(null);
const imageSrc = ref<string | undefined>(undefined);

const renderCanvas = async (
  element: HTMLElement,
  options: { background?: string; type: "jpg" | "png" }
) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: options.background ?? null,
  });

  if (options.type === "jpg") {
    return canvas.toDataURL("image/jpeg", 1.0);
  }

  return canvas.toDataURL("image/png");
};

const generateImage = async () => {
  loadingStore.startLoading();
  await nextTick();

  const element = imageTarget.value;
  if (!element) {
    loadingStore.stopLoading();
    return;
  }

  imageSrc.value = await renderCanvas(element, { type: "png" });

  loadingStore.stopLoading();
};

const downloadImage = async () => {
  await nextTick();

  const element = imageTarget.value;
  if (!element) return;

  const dataURL = await renderCanvas(element, {
    background: colorHex[selectedColor.value] || "#ffffff",
    type: "jpg",
  });

  Object.assign(document.createElement("a"), {
    href: dataURL,
    download: "schedule-class.jpg",
  }).click();
};
</script>
