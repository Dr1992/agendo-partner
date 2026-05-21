import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

/** `null` = seguir o sistema (`useColorScheme`). */
export type ColorSchemeOverride = "light" | "dark" | null;

const STORAGE_KEY = "@agendo/colorSchemeOverride";

const jsonStorage = createJSONStorage<ColorSchemeOverride>(() => AsyncStorage);

export const colorSchemeOverrideAtom = atomWithStorage<ColorSchemeOverride>(
  STORAGE_KEY,
  null,
  jsonStorage,
);
