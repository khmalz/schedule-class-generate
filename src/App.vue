<script setup lang="ts">
import { RouterView } from "vue-router";
import { useMeta } from "vue-meta";

useMeta({
  title: "Schedule Class Generator - Convert Plain Text into Class Timetable",
  meta: [
    {
      name: "description",
      content:
        "A simple and efficient tool to generate a class schedule from plain text input. Ideal for students, teachers, and anyone looking to organize their time quickly.",
    },
    {
      name: "keywords",
      content:
        "schedule generator, class scheduler, text to schedule, automatic timetable, student planner, teacher tools, school scheduler, vue, pinia, tailwind css, open source, education, indonesia",
    },
    {
      property: "og:title",
      content: "Schedule Class Generator - Make Timetables from Text",
    },
    {
      property: "og:description",
      content:
        "Turn text into a well-organized class schedule with ease. Fast and reliable solution for students and educators.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://schedule-class-generate.vercel.app",
    },
    {
      property: "og:image",
      content: "/images/schedule-class.webp",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://schedule-class-generate.vercel.app",
    },
  ],
});
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `${content}` : `Schedule Class Generator`
    }}</template>
  </metainfo>

  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped></style>
