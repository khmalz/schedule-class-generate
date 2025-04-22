<template>
  <div class="max-w-4xl mx-auto mt-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Class Schedule</h2>
      <p class="text-sm">
        By:
        <a href="https://github.com/khmalz" target="_blank" class="text-cyan-500 font-semibold">
          github.com/khmalz
        </a>
      </p>
    </div>

    <div class="overflow-x-auto border border-gray-300 rounded">
      <table class="min-w-full table-fixed border-collapse">
        <thead>
          <tr class="bg-blue-800 text-white">
            <th class="w-20 text-sm p-2 border border-white text-left">WAKTU</th>
            <th v-for="day in days" :key="day" class="text-sm p-2 border border-white">
              {{ day }}
            </th>
          </tr>
        </thead>

        <tbody class="text-sm text-center">
          <tr
            v-for="(hour, index) in hours"
            :key="hour"
            :class="index % 2 === 0 ? 'bg-blue-50' : 'bg-white'"
          >
            <td class="text-center text-black border border-gray-300 px-2 py-2 font-medium">
              {{ hour }}
            </td>

            <td
              v-for="day in days"
              :key="day + hour"
              :id="`${day}_${hour.replace(':', '.')}`"
              class="border border-gray-300 px-0 py-0"
            >
              <div class="grid grid-rows-4 h-full divide-gray-300 relative">
                <div
                  v-for="quarter in 4"
                  :key="quarter"
                  :id="`${day}_${hour.replace(':', '.')}_q${quarter}`"
                  class="h-4"
                ></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const hours = [];
for (let i = 8; i <= 17; i++) {
  hours.push(`${String(i).padStart(2, "0")}:00`);
}

const schedule = {
  Senin: [
    {
      subject: "Matematika",
      time: "10.00-11.40",
      desc: "Ruang 101",
    },
  ],
  Selasa: [
    {
      subject: "Bahasa Inggris",
      time: "13.00-14.40",
      desc: "Ruang 501",
    },
    {
      subject: "Pendidikan Agama",
      time: "10.30-12.30",
      desc: "online",
    },
  ],
};

import { onMounted } from "vue";

onMounted(() => {
  paintSchedule(schedule);
});

function getQuarterID(day: string, time: string): string {
  const total_minutes = 60;
  const quarter_length = 15;

  const [stringHour, stringMinute] = time.split(".");
  const timeHour = Number(stringHour);
  const timeMinute = Number(stringMinute);

  const totalTimeInMinutes = timeHour * total_minutes + timeMinute;

  const quarter = Math.floor((totalTimeInMinutes % total_minutes) / quarter_length) + 1;

  return `${day}_${stringHour}.00_q${quarter}`;
}

function paintSchedule(data) {
  Object.entries(data).forEach(([day, items]) => {
    items.forEach(({ subject, time, desc }) => {
      const [startStr, endStr] = time.split("-").map((t) => t.trim());

      createEventOverlay(day, startStr, endStr, subject, desc);
    });
  });
}

function createEventOverlay(day, startStr, endStr, subject, desc) {
  const startID = getQuarterID(day, startStr);
  const endID = getQuarterID(day, endStr);

  const startEl = document.getElementById(startID);
  const endEl = document.getElementById(endID);

  if (!startEl || !endEl) {
    console.error("One of the elements was not found in the DOM.");
    return;
  }

  const startRect = startEl.getBoundingClientRect();
  const endRect = endEl.getBoundingClientRect();
  const parentRect = startEl.parentNode.getBoundingClientRect();
  const height = endRect.bottom - startRect.top;
  const top = startRect.top - parentRect.top;

  const overlayHTML = `
    <div class="absolute left-0 right-0 border rounded-xs bg-green-300 px-1 text-xs text-black" style="height: ${height}px; top: ${top}px;">
      <div>
        <div class="font-semibold">${subject}</div>
        <div class="text-[10px] text-gray-700">${desc}</div>
      </div>
      <div class="text-[10px]">${startStr}-${endStr}</div>
    </div>
  `;

  startEl.parentNode.insertAdjacentHTML("beforeend", overlayHTML);
}
</script>

<style scoped>
td > div > div.bg-green-300 {
  border-radius: 4px;
  transition: all 0.2s ease-in-out;
}
</style>
