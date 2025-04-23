import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { createMetaManager, useMeta } from "vue-meta";

const metaManager = createMetaManager();
useMeta(
  {
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
  },
  metaManager
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(metaManager);

app.mount("#app");
