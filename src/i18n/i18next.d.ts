import "i18next";

import type enBooking from "./locales/en/booking.json";
import type enComponents from "./locales/en/components.json";
import type enNavigation from "./locales/en/navigation.json";
import type enOnboarding from "./locales/en/onboarding.json";
import type enPartner from "./locales/en/partner.json";
import type enStaff from "./locales/en/staff.json";
import type enTeam from "./locales/en/team.json";
import type en from "./locales/en.json";

/**
 * `en.json` é usado como fonte da forma das chaves: ele é o locale completo
 * garantido por teste de paridade, e qualquer chave inexistente em `t()`
 * quebra o `tsc`. O conteúdo (PT) vem de `pt.json` em runtime.
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
      components: typeof enComponents;
      onboarding: typeof enOnboarding;
      booking: typeof enBooking;
      partner: typeof enPartner;
      team: typeof enTeam;
      staff: typeof enStaff;
      navigation: typeof enNavigation;
    };
  }
}
