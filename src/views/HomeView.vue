<template>
  <main class="py-8 max-w-4xl lg:max-w-7xl mx-auto w-full">
    <h1 class="text-center text-2xl md:text-3xl lg:text-4xl font-bold">
      Schedule Class Generate by Text
    </h1>

    <div
      class="max-w-4xl lg:max-w-7xl mx-auto p-4 bg-white rounded-2xl shadow-md border mt-5"
      id="guide"
    >
      <h2 class="text-xl md:text-2xl font-semibold mb-2 text-gray-800">📘 Schedule Input Guide</h2>
      <p class="text-base md:text-lg text-gray-600 mb-4">
        Please enter your schedule in the <strong>text area</strong> below using the following
        format:
      </p>

      <pre class="bg-gray-100 text-xs md:text-sm text-gray-800 p-4 rounded-lg whitespace-pre-wrap">
Senin:
Matematika, 10.00-11.40, Ruang 101

Selasa:
Bahasa Inggris, 13.00-14.40, Ruang 501
Pendidikan Agama, 10.00-12.30, online
    </pre
      >
      <ul class="mt-4 text-base md:text-lg text-gray-700 list-disc list-inside space-y-1">
        <li>
          <span class="font-medium">Day</span> must be written at the beginning of the line, ending
          with a colon (e.g., <code>Senin:</code>).
        </li>
        <li>
          Each subject should be written in one line and separated by a comma, like the format:
          <code
            class="bg-gray-500/90 p-0.5 rounded-sm inline-flex text-slate-100 text-xs md:text-sm"
            >Subject Name, Start-End Time, Description</code
          >
        </li>
        <li>Use 24-hour format for time</li>
        <li>
          <span class="font-medium">Make sure</span> the separator between hour and minute is a dot
          (e.g., <code class="text-sm md:text-base">10.00</code>).
        </li>
        <li>
          Leave an empty line between different days for better readability. (as the example above)
        </li>
      </ul>
    </div>

    <input-schedule @click="generate" v-model="input" />

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
      <h2 class="text-xl md:text-2xl font-semibold text-gray-800 mb-2">📝 Schedule Result</h2>

      <div class="py-2 flex flex-col lg:flex-row lg:gap-x-3 gap-y-2" v-if="imageSrc">
        <img :src="imageSrc" class="border rounded w-3xl" />

        <div class="w-full">
          <button
            @click="downloadImage"
            class="bg-gray-600 hover:bg-gray-700 text-white p-2 md:p-4 lg:p-5 rounded border text-sm md:text-base flex items-center px-4 gap-x-2"
          >
            <span>Export to Image</span>
            <svg
              class="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm.394 9.553a1 1 0 0 0-1.817.062l-2.5 6A1 1 0 0 0 8 19h8a1 1 0 0 0 .894-1.447l-2-4A1 1 0 0 0 13.2 13.4l-.53.706-1.276-2.553ZM13 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="result"
      :key="scheduleKey"
      ref="imageTarget"
      class="fixed left-[200vw] top-0 p-4 bg-cyan-950 rounded shadow z-[-1]"
    >
      <schedule-view :key="scheduleKey" :schedule="result" :times="times" />
    </div>
  </main>
</template>

<script setup lang="ts">
import InputSchedule from "@/components/input-schedule.vue";
import { nextTick, ref } from "vue";
import type { ScheduleMap } from "@/types/schedule";
import html2canvas from "html2canvas-pro";
import ScheduleView from "./ScheduleView.vue";
import { useScheduleStore } from "@/stores/schedule";
import { convertTimeToNumber, normalizeTime, parseTime } from "@/utils/time";
import { useLoadingStore } from "@/stores/loading";
import { useWarningsStore } from "@/stores/warning";
import { useColorStore } from "@/stores/colors";

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

// -----------------------------------------------------------------------------------

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
      const { start, end } = parseTime(time);

      if (!min_time || start < min_time) min_time = start;
      if (!max_time || end > max_time) max_time = end;

      const color = colorsStore.getRandomColor();
      scheduleStore.addSchedule(currentDay, { subject, time, desc, color });
    }
  });

  if (!min_time || !max_time) return [scheduleStore.schedule, 8, 17];

  const min_number: number = convertTimeToNumber({ time: min_time, isFloor: true });
  let max_number: number = convertTimeToNumber({ time: max_time, isCeil: true });
  if (max_number == 0) max_number = 24;

  return [scheduleStore.schedule, min_number, max_number];
}

function validateInput(input: string): string[] {
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

      const time = parts[1];
      if (!timePattern.test(time)) {
        errors.push(
          `⚠️ Invalid time format at line ${index + 1}: "${time}". Use format (e.g., 10.00-11.00)`
        );
      } else {
        const [startStr, endStr] = time.split("-");
        const today = new Date().toISOString().split("T")[0];
        const start = new Date(`${today}T${normalizeTime(startStr)}`);
        const end = new Date(`${today}T${normalizeTime(endStr)}`);

        if (end < start) {
          errors.push(`⚠️ Invalid time range at line ${index + 1}: end time earlier than start.`);
        }
      }
    } else {
      errors.push(`⚠️ Cannot determine day for line ${index + 1}: "${line}"`);
    }
  });

  return errors;
}
</script>
