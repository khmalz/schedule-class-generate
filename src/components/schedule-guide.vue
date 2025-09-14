<template>
  <div
    class="max-w-4xl lg:max-w-7xl mx-auto p-4 pl-6 md:pl-10 pr-4 md:pr-8 bg-white rounded-2xl shadow-md border mt-3"
    id="guide"
  >
    <p class="text-xs sm:text-sm md:text-base xl:text-lg text-gray-800 font-medium mb-4">
      {{ $t("schedule.subtitle") }}
    </p>
    <pre
      v-if="locale === 'id'"
      class="bg-[#0533452E] text-xs md:text-sm text-black font-normal p-4 rounded-lg whitespace-pre-wrap"
    >
Senin:
Matematika, 10.00-11.40, Ruang 101

Selasa:
Bahasa Inggris, 13.00-14.40, Ruang 501
Pendidikan Agama, 10.00-12.30, online
  </pre
    >

    <pre
      v-else-if="locale === 'en'"
      class="bg-[#0533452E] text-xs md:text-sm text-black font-normal p-4 rounded-lg whitespace-pre-wrap"
    >
Monday:
Math, 10.00-11.40, Room 101

Tuesday:
English, 13.00-14.40, Room 501
Religious Studies, 10.00-12.30, online
  </pre
    >
    <ul
      class="mt-4 text-xs sm:text-sm md:text-base xl:text-lg text-gray-800 font-light list-disc list-outside pl-4"
    >
      <li v-for="(text, index) in guideTexts" :key="index">
        <template v-if="index === 1">
          {{ text }}
          <div class="flex justify-center my-1">
            <code
              class="bg-[#0533457D] p-[5px] rounded-sm text-black font-normal text-xs lg:text-sm 2xl:text-base"
            >
              {{ guideFormat }}
            </code>
          </div>
        </template>
        <template v-else>
          {{ text }}
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { tm, locale } = useI18n();

const guideTexts = tm("schedule.guide.texts") as string[];
const guideFormat = tm("schedule.guide.format") as string;
</script>
