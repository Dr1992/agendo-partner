import AsyncStorage from "@react-native-async-storage/async-storage";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

/** `null` = usar o idioma padrão (pt-BR). */
export type LocaleOverride = "pt" | "en" | null;

const STORAGE_KEY = "@agendo/localeOverride";

const jsonStorage = createJSONStorage<LocaleOverride>(() => AsyncStorage);

export const localeOverrideAtom = atomWithStorage<LocaleOverride>(
  STORAGE_KEY,
  null,
  jsonStorage,
);
