import { useAtom } from "jotai";

import {
  type ColorSchemeOverride,
  colorSchemeOverrideAtom,
} from "../atoms/colorSchemeOverrideAtom";
import { type AppTheme, getTheme } from "../theme";
import { useResolvedColorScheme } from "./useResolvedColorScheme";

type UseAppThemeResult = {
  theme: AppTheme;
  resolvedScheme: "light" | "dark";
  override: ColorSchemeOverride;
  setOverride: (value: ColorSchemeOverride) => void;
};

export function useAppTheme(): UseAppThemeResult {
  const resolvedScheme = useResolvedColorScheme();
  const [override, setOverride] = useAtom(colorSchemeOverrideAtom);

  return {
    override,
    resolvedScheme,
    setOverride,
    theme: getTheme(resolvedScheme),
  };
}
