import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enBooking from "./locales/en/booking.json";
import enComponents from "./locales/en/components.json";
import enNavigation from "./locales/en/navigation.json";
import enOnboarding from "./locales/en/onboarding.json";
import enPartner from "./locales/en/partner.json";
import enStaff from "./locales/en/staff.json";
import enTeam from "./locales/en/team.json";
import en from "./locales/en.json";
import ptBooking from "./locales/pt/booking.json";
import ptComponents from "./locales/pt/components.json";
import ptNavigation from "./locales/pt/navigation.json";
import ptOnboarding from "./locales/pt/onboarding.json";
import ptPartner from "./locales/pt/partner.json";
import ptStaff from "./locales/pt/staff.json";
import ptTeam from "./locales/pt/team.json";
import pt from "./locales/pt.json";

export const SUPPORTED_LOCALES = ["pt", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Namespaces de tradução. `translation` é o namespace padrão (textos globais:
 * common/language/tabs/profile). Os demais são por área do app — cada lote de
 * telas tem o seu, para manter os arquivos de tradução navegáveis.
 */
export const I18N_NAMESPACES = [
  "translation",
  "components",
  "onboarding",
  "booking",
  "partner",
  "team",
  "staff",
  "navigation",
] as const;

void i18n.use(initReactI18next).init({
  resources: {
    pt: {
      translation: pt,
      components: ptComponents,
      onboarding: ptOnboarding,
      booking: ptBooking,
      partner: ptPartner,
      team: ptTeam,
      staff: ptStaff,
      navigation: ptNavigation,
    },
    en: {
      translation: en,
      components: enComponents,
      onboarding: enOnboarding,
      booking: enBooking,
      partner: enPartner,
      team: enTeam,
      staff: enStaff,
      navigation: enNavigation,
    },
  },
  lng: "pt",
  fallbackLng: "pt",
  ns: I18N_NAMESPACES,
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
