import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthProviderId } from "../types/auth";

const KEY = "@agendo/auth_tokens_v1";

export type StoredAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAtMs: number;
  idToken?: string;
  provider: AuthProviderId;
};

export async function saveAuthTokens(t: StoredAuthTokens): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(t));
}

export async function loadAuthTokens(): Promise<StoredAuthTokens | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredAuthTokens;
  } catch {
    return null;
  }
}

export async function clearAuthTokens(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
