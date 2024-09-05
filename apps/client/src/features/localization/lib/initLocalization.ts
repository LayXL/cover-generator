import i18n from "i18next"
import Fluent from "i18next-fluent"
import Backend from "i18next-fluent-backend"
import { Settings } from "luxon"
import { initReactI18next } from "react-i18next"

export const activeLanguage = "ru"

export const initLocalization = () => {
  i18n
    .use(Fluent)
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: activeLanguage,
      fallbackLng: "ru",
      interpolation: { escapeValue: false },
      backend: {
        loadPath: "/locales/{{lng}}.ftl",
      },
    })

  Settings.defaultLocale = activeLanguage
}
