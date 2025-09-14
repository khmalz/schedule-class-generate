import { nextTick, type App, type Ref } from "vue";
import { createI18n } from "vue-i18n";
import defaultMessages from "../translations/id.json";

export const supportedLocales = ["id", "en"];
export const defaultLocale = "id";

let _i18n: ReturnType<typeof createI18n>;

function setup(options = { locale: defaultLocale }) {
  _i18n = createI18n({
    legacy: false,
    locale: options.locale,
    fallbackLocale: defaultLocale,
    messages: { [defaultLocale]: defaultMessages },
  });

  setLocale(options.locale);

  return _i18n;
}

async function loadMessagesFor(locale: string) {
  const messages = await import(`../translations/${locale}.json`);
  _i18n.global.setLocaleMessage(locale, messages.default);
  return nextTick();
}

function setLocale(newLocale: string) {
  (_i18n!.global.locale as Ref<string>).value = newLocale;
}

export default {
  install(app: App) {
    const i18n = setup();
    app.use(i18n);
  },
  get vueI18n() {
    return _i18n;
  },
  setup,
  setLocale,
  loadMessagesFor,
};
