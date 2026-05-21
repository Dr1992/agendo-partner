import { useAtomValue } from "jotai";
import { useColorScheme } from "react-native";

import { colorSchemeOverrideAtom } from "../atoms/colorSchemeOverrideAtom";

export function useResolvedColorScheme(): "light" | "dark" {
  const system = useColorScheme();
  const override = useAtomValue(colorSchemeOverrideAtom);

  if (override !== null) {
    return override;
  }

  return system === "dark" ? "dark" : "light";
}
