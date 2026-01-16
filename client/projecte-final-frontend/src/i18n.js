// src/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enJSON from "./locales/en.json";
import caJSON from "./locales/ca.json";
import esJSON from "./locales/es.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      ca: { translation: caJSON },
      es: { translation: esJSON}
    },
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    interpolation: { escapeValue: false }
  });

export default i18n;