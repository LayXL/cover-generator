import i18n from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { Settings } from "luxon"
import { initReactI18next } from "react-i18next"

export const activeLanguage = "ru"

export const activeLanguageId =
  Object.entries({
    en: 1,
    ru: 2,
  }).find(([x]) => x === activeLanguage)?.[1] ?? 1

export default function () {
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (lang: string) => import(`../../../locales/${lang}.json`)
      )
    )
    .init({
      lng: activeLanguage,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    })

  Settings.defaultLocale = activeLanguage
}
