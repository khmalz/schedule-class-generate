<template>
  <main class="py-8 max-w-4xl mx-auto w-full">
    <h1 class="text-center text-4xl font-bold">Schedule Generate by Text</h1>

    <div class="max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-md border mt-5" id="guide">
      <h2 class="text-xl font-semibold mb-2 text-gray-800">📘 Schedule Input Guide</h2>
      <p class="text-sm text-gray-600 mb-4">
        Please enter your schedule in the <strong>text area</strong> below using the following
        format:
      </p>

      <pre class="bg-gray-100 text-sm text-gray-800 p-4 rounded-lg whitespace-pre-wrap">
Senin:
Matematika, 10.00-11.40, Ruang 101

Selasa:
Bahasa Inggris, 13.00-14.40, Ruang 501
Pendidikan Agama, 10.00-12.30, online
    </pre
      >
      <ul class="mt-4 text-sm text-gray-700 list-disc list-inside space-y-1">
        <li>
          <span class="font-medium">Day</span> must be written at the beginning of the line, ending
          with a colon (e.g., <code>Senin:</code>).
        </li>
        <li>
          Each subject should be written in one line and separated by a comma, like the format:
          <code class="bg-gray-500/90 p-0.5 rounded-sm inline-flex text-slate-100"
            >Subject Name, Start-End Time, Description</code
          >
        </li>
        <li>Use 24-hour format for time</li>
        <li>
          <span class="font-medium">Make sure</span> the separator between hour and minute is a dot
          (e.g., <code>10.00</code>).
        </li>
        <li>
          Leave an empty line between different days for better readability. (as the example above)
        </li>
      </ul>
    </div>

    <Input-schedule @click="generate" v-model="input" />

    <div
      v-if="warnings.length"
      class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mt-6"
    >
      <h3 class="font-semibold mb-2">⚠️ Warning</h3>
      <ul class="list-disc pl-5 space-y-1 text-sm">
        <li v-for="(warn, index) in warnings" :key="index">{{ warn }}</li>
      </ul>
    </div>

    <div
      v-if="warnings.length === 0 && result"
      class="max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-md border mt-5"
      id="result"
    >
      <h2 class="text-xl font-semibold mb-2 text-gray-800">📝 Schedule Result</h2>
      <pre class="bg-gray-100 text-sm text-gray-800 p-4 rounded-lg whitespace-pre-wrap"
        >{{ result }}
      </pre>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputSchedule from "@/components/input-schedule.vue";
import { ref } from "vue";

const input = ref<string>("");
const result = ref<ScheduleMap | null>(null);
const warnings = ref<string[]>([]);

const generate = () => {
  warnings.value = validateInput(input.value);
  if (warnings.value.length > 0) {
    result.value = null;
    return;
  }

  const [schedule] = parseSchedule(input.value);
  result.value = schedule;
};

type ScheduleItem = {
  subject: string;
  time: string;
  desc: string;
};

type ScheduleMap = Record<string, ScheduleItem[]>;

function parseSchedule(input: string): [ScheduleMap, Date, Date] {
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
  const schedule: ScheduleMap = {};
  let currentDay = "";

  lines.forEach((line: string) => {
    line = line.trim();
    if (line === "") return;

    const cleanedLine = line.toLowerCase().replace(/\s*:\s*$/, ":");
    const key = cleanedLine.split(":")[0];
    const foundDay = dayMap[key];

    if (foundDay) {
      currentDay = foundDay;

      if (!schedule[currentDay]) {
        schedule[currentDay] = [];
      }
    } else if (currentDay) {
      const [subject, time, desc] = line.split(",").map((p) => p.trim());
      const { start, end } = parseTime(time);

      if (!min_time || start < min_time) min_time = start;
      if (!max_time || end > max_time) max_time = end;

      schedule[currentDay].push({ subject, time, desc });
    }
  });

  console.log({ min_time, max_time });

  return [schedule, min_time, max_time];
}

function parseTime(time: string) {
  const [startStr, endStr] = time.split("-").map((s) => s.trim());
  const today = new Date().toISOString().split("T")[0];

  const start = new Date(`${today}T${normalizeTime(startStr)}`);
  const end = new Date(`${today}T${normalizeTime(endStr)}`);

  return { start, end };
}

function normalizeTime(input: string): string {
  const parts = input.replace(/\./g, ":").split(":");
  const [hour, minute] = parts;

  const hh = hour.padStart(2, "0");
  const mm = (minute || "00").padStart(2, "0");

  return `${hh}:${mm}:00`;
}

function validateInput(input: string): string[] {
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
