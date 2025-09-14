import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import i18n, { supportedLocales } from "@/i18n";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:locale?",
      name: "home",
      component: HomeView,
    },
  ],
});

router.beforeEach(async (to, from) => {
  const shortLocale = to.params.locale as string | undefined;

  if (!shortLocale) {
    return {
      name: to.name ?? "home",
      params: { ...to.params, locale: "id" },
      query: to.query,
      hash: to.hash,
    };
  }

  if (!supportedLocales.includes(shortLocale)) {
    return {
      name: to.name ?? "home",
      params: { ...to.params, locale: "id" },
      query: to.query,
      hash: to.hash,
    };
  }

  const prevShortLocale = from.params.locale as string | undefined;
  if (shortLocale === prevShortLocale) {
    return;
  }

  await i18n.loadMessagesFor(shortLocale);
  i18n.setLocale(shortLocale);
});

export default router;
