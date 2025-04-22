<template>
  <div class="max-w-4xl lg:max-w-7xl mx-auto mt-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold">Class Schedule</h2>
      <p class="text-base md:text-lg">
        By:
        <a
          href="https://github.com/khmalz"
          target="_blank"
          class="text-cyan-500 text-base md:text-lg font-semibold"
        >
          github.com/khmalz
        </a>
      </p>
    </div>

    <div class="overflow-x-auto border border-gray-300 rounded">
      <table class="min-w-full table-fixed border-collapse">
        <thead>
          <tr class="bg-blue-800 text-white">
            <th class="w-20 text-sm md:text-base lg:text-xl p-2 border border-white text-center">
              Waktu
            </th>
            <th
              v-for="day in days"
              :key="day"
              class="text-sm md:text-base lg:text-xl py-4 px-8 md:px-10 lg:py-6 border border-white"
            >
              {{ day }}
            </th>
          </tr>
        </thead>

        <tbody class="text-sm md:text-base lg:text-xl text-center">
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
              <div class="grid grid-rows-4 h-full relative">
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
      desc: "Lorem ipsum dolor sit amet consectetur",
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
    <div class="absolute left-0 right-0 border rounded-xs bg-green-300 px-1 text-black" style="height: ${height}px; top: ${top}px;">
      <div>
        <div class="font-semibold text-sm md:text-base lg:text-lg">${subject}</div>
        <div class="${
          desc.length > 35 ? "text-[12px] md:text-xs lg:text-sm" : "text-xs md:text-sm lg:text-base"
        } text-gray-700 my-1">
          ${desc}
        </div>
      </div>
      <div class="text-sm md:text-base lg:text-lg">${startStr}-${endStr}</div>
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
