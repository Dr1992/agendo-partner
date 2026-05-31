import { useAtom } from "jotai";
import { useEffect } from "react";

import i18n, { type SupportedLocale } from "./index";
import { type LocaleOverride, localeOverrideAtom } from "./localeAtom";
import { applyCalendarLocale } from "../utils/calendarLocalePt";

/** Resolve a preferência salva para o idioma efetivo da UI. */
export function resolveLocale(override: LocaleOverride): SupportedLocale {
  return override ?? "pt";
}

type UseLocaleResult = {
  override: LocaleOverride;
  setOverride: (value: LocaleOverride) => void;
  resolved: SupportedLocale;
};

/**
 * Lê a preferência de idioma persistida, resolve o idioma efetivo e mantém o
 * i18next sincronizado. Espelha o padrão de `useAppTheme`.
 */
export function useLocale(): UseLocaleResult {
  const [override, setOverride] = useAtom(localeOverrideAtom);
  const resolved = resolveLocale(override);

  useEffect(() => {
    if (i18n.language !== resolved) {
      void i18n.changeLanguage(resolved);
    }
    applyCalendarLocale(resolved);
  }, [resolved]);

  return { override, setOverride, resolved };
}
