<template>
  <main class="py-8 max-w-4xl lg:max-w-7xl mx-auto w-full">
    <h1 class="text-center text-2xl md:text-3xl lg:text-4xl font-bold">
      Schedule Class Generate by Text
    </h1>

    <div class="flex gap-x-5 gap-y-5 md:gap-y-0 mt-5 flex-col md:flex-row">
      <div class="md:w-2/3 w-full">
        <h2 class="text-xl md:text-2xl font-semibold text-white">Schedule Input Guide</h2>

        <div ref="guideBoxRef">
          <schedule-guide />
        </div>
      </div>
      <div class="md:w-1/3 w-full">
        <h2 class="text-xl md:text-2xl font-semibold text-white">Input Here:</h2>
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
      class="max-w-4xl lg:max-w-7xl mx-auto p-4 bg-white rounded-2xl shadow-md border mt-5"
      id="result"
    >
      <div class="py-2 flex flex-col xl:gap-x-3 xl:gap-y-0 gap-y-2 items-center" v-if="imageSrc">
        <div>
          <img :src="imageSrc" class="border rounded w-3xl lg:w-[60rem]" />
          <div class="w-full mt-5 flex gap-x-3 justify-between">
            <button
              @click="downloadImage"
              class="bg-gray-700 hover:bg-gray-800 text-white rounded-lg border text-sm md:text-base px-9 py-3"
            >
              Export Schedule
            </button>

            <div class="inline-flex justify-start items-center gap-x-6">
              <button
                v-for="(color, i) in colors"
                :key="color"
                :class="[
                  `w-10 h-10 rounded-full bg-${color} border ${borders[i]}`,
                  selectedColor === color ? 'ring-3 ring-cyan-500 ring-offset-2' : '',
                ]"
                @click="selectColor(color)"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="result && selectedColor"
      :key="`${scheduleKey}-${selectedColor}`"
      ref="imageTarget"
      :class="['fixed left-[200vw] top-0 p-4 rounded shadow z-[-1]', colorClasses[selectedColor]]"
    >
      <schedule-view :key="`${scheduleKey}-${selectedColor}`" :schedule="result" :times="times" />
    </div>
  </main>
</template>

<script setup lang="ts">
import InputScheduleDesktop from "@/components/input-schedule-desktop.vue";
import InputScheduleMobile from "@/components/input-schedule-mobile.vue";
import { nextTick, onMounted, reactive, ref, onBeforeUnmount, watch } from "vue";
import type { ScheduleMap } from "@/types/schedule";
import html2canvas from "html2canvas-pro";
import ScheduleView from "./ScheduleView.vue";
import { useScheduleStore } from "@/stores/schedule";
import { convertTimeToNumber, formatHourMinute, normalizeTime, parseTime } from "@/utils/time";
import { useLoadingStore } from "@/stores/loading";
import { useWarningsStore } from "@/stores/warning";
import { useColorStore } from "@/stores/colors";
import ButtonGenerate from "@/components/button-generate.vue";
import ScheduleGuide from "@/components/schedule-guide.vue";

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

const colorClasses: Record<string, string> = {
  "slate-200": "bg-slate-200",
  "zinc-950": "bg-zinc-950",
  "red-900": "bg-red-900",
  "amber-700": "bg-amber-700",
  "yellow-400": "bg-yellow-400",
  "emerald-900": "bg-emerald-900",
  "cyan-950": "bg-cyan-950",
  "fuchsia-800": "bg-fuchsia-800",
  "pink-500": "bg-pink-500",
  "slate-700": "bg-slate-700",
};

const colors: string[] = [
  "zinc-950",
  "red-900",
  "amber-700",
  "yellow-400",
  "emerald-900",
  "cyan-950",
  "fuchsia-800",
  "pink-500",
  "slate-700",
];

const borders: string[] = [
  "border-gray-500",
  "border-red-500",
  "border-amber-900",
  "border-yellow-600",
  "border-emerald-500",
  "border-cyan-400",
  "border-fuchsia-900",
  "border-pink-700",
  "border-slate-400",
];

const selectedColor = ref("cyan-950");
const selectColor = (color: string) => (selectedColor.value = color);

watch(selectedColor, async () => {
  if (result.value) {
    await nextTick();
    generateImage();
  }
});

const input = ref<string>("");
const result = ref<ScheduleMap | null>(null);
const times = ref<{ min: number; max: number }>();
const scheduleKey = ref(0);

const generate = () => {
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

  nextTick(() => {
    generateImage();
  });
};

function generateSchedule(input: string): [ScheduleMap, number, number] {
  let min_time: Date | null = null;
  let max_time: Date | null = null;

  const dayMap: Record<string, string> = {
    senin: "Senin",
    monday: "Senin",
    selasa: "Selasa",
    tuesday: "Selasa",
    rabu: "Rabu",
    wednesday: "Rabu",
    kamis: "Kamis",
    thursday: "Kamis",
    jumat: "Jumat",
    friday: "Jumat",
    sabtu: "Sabtu",
    saturday: "Sabtu",
    minggu: "Minggu",
    sunday: "Minggu",
  };

  const lines = input.trim().split("\n");

  let currentDay = "";

  lines.forEach((line: string) => {
    line = line.trim();
    if (line === "") return;

    const cleanedLine = line.toLowerCase().replace(/\s*:\s*$/, ":");
    const key = cleanedLine.split(":")[0];
    const foundDay = dayMap[key];

    if (foundDay) {
      currentDay = foundDay;
    } else if (currentDay) {
      const [subject, time, desc] = line.split(",").map((p) => p.trim());
      const formattedTime = time.split("-").map(formatHourMinute).join("-");
      const { start, end } = parseTime(formattedTime);

      if (!min_time || start < min_time) min_time = start;
      if (!max_time || end > max_time) max_time = end;

      const color = colorsStore.getRandomColor();
      scheduleStore.addSchedule(currentDay, { subject, time: formattedTime, desc, color });
    }
  });

  if (!min_time || !max_time) return [scheduleStore.schedule, 8, 17];

  const min_number: number = convertTimeToNumber({ time: min_time, isFloor: true });
  let max_number: number = convertTimeToNumber({ time: max_time, isCeil: true });

  if (max_number > 24 || max_number === 0) max_number = 23;

  return [scheduleStore.schedule, min_number, max_number];
}

function validateInput(input: string): string[] {
  warningsStore.clearWarnings();
  if (!input) return ["⚠️ Please enter some input."];

  const errors: string[] = [];
  const lines = input.trim().split("\n");
  const validDayPattern = /^[A-Za-z]+:$/;
  const timePattern = /^\d{1,2}\.\d{2}-\d{1,2}\.\d{2}$/;
  let currentDay = "";

  lines.forEach((line, index) => {
    line = line.trim();
    if (line === "") return;

    if (validDayPattern.test(line)) {
      currentDay = line.toLowerCase().replace(":", "");
    } else if (currentDay) {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length !== 3) {
        errors.push(
          `⚠️ Line ${index + 1} is not valid. Must contain subject, time, and description.`
        );
        return;
      }

      const desc = parts[2];
      if (desc.length > 45) {
        errors.push(`⚠️ Description have to be less than 45 characters.`);
      }

      const time = parts[1];
      if (!timePattern.test(time)) {
        errors.push(
          `⚠️ Invalid time format at line ${index + 1}: "${time}". Use format (e.g., 10.00-11.00)`
        );
      } else {
        const [startStr, endStr] = time.split("-");

        const [startHour, startMinute] = startStr.split(".").map(Number);
        const [endHour, endMinute] = endStr.split(".").map(Number);
        if (startHour > 24 || startMinute >= 60 || endHour > 24 || endMinute >= 60) {
          errors.push(
            `⚠️ Invalid time range at line ${index + 1}: hours must be ≤ 24 and minutes < 60.`
          );
        } else {
          if (startHour === 24 && startMinute >= 0) {
            errors.push(`⚠️ Invalid start time at line ${index + 1}: limit (00.00-23.59)`);
          }

          if (endHour === 24 && endMinute >= 0) {
            errors.push(`⚠️ Invalid end time at line ${index + 1}: limit (00.00-23.59)`);
          }

          const today = new Date().toISOString().split("T")[0];
          const start = new Date(`${today}T${normalizeTime(startStr)}`);
          const end = new Date(`${today}T${normalizeTime(endStr)}`);

          if (end < start) {
            errors.push(`⚠️ Invalid time range at line ${index + 1}: end time earlier than start.`);
          }
        }
      }
    } else {
      errors.push(`⚠️ Cannot determine day for line ${index + 1}: "${line}"`);
    }
  });

  return errors;
}

// --------------------------------------------------------------------------------

const imageTarget = ref(null);
const imageSrc = ref<string | undefined>(undefined);

const loadingStore = useLoadingStore();
const warningsStore = useWarningsStore();
const scheduleStore = useScheduleStore();
const colorsStore = useColorStore();

const generateImage = async () => {
  loadingStore.startLoading();
  await nextTick();

  const element = imageTarget.value;
  if (!element) {
    loadingStore.stopLoading();
    return;
  }

  const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  imageSrc.value = canvas.toDataURL("image/jpg");

  loadingStore.stopLoading();
};

function downloadImage() {
  if (!imageSrc.value) return;
  const link = document.createElement("a");
  link.href = imageSrc.value;
  link.download = "schedule-preview.jpg";
  link.click();
}
</script>
