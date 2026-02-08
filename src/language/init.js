import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./ru.json";
import uz from "./uz.json";

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: ru,
    },
    uz: {
      translation: uz,
    },
  },

  lng: "ru", // язык по умолчанию
  fallbackLng: "ru", // если ключ не найден

  interpolation: {
    escapeValue: false, // react уже экранирует
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
