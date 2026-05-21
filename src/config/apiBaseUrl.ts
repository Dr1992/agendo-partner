import Constants from "expo-constants";
import { Platform } from "react-native";

/** No emulador Android, `localhost` / `127.0.0.1` é o próprio emulador — o host do PC é `10.0.2.2`. */
function rewriteLocalhostForAndroid(url: string): string {
  if (Platform.OS !== "android") {
    return url;
  }
  return url
    .replace("://localhost", "://10.0.2.2")
    .replace("://127.0.0.1", "://10.0.2.2");
}

/**
 * Base URL do backend (sem `/api/v1`).
 * Defina `EXPO_PUBLIC_API_BASE_URL` no `.env` do app (ex.: `http://192.168.1.10:3000` no telefone físico).
 * Em dev, se não houver `.env`, tenta o host do Metro (útil em LAN).
 * Com emulador Android, `localhost` no `.env` é reescrito para `10.0.2.2` automaticamente.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) {
    return rewriteLocalhostForAndroid(fromEnv.replace(/\/$/, ""));
  }

  if (!__DEV__) {
    return "http://localhost:3000";
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];
  if (host && host !== "127.0.0.1" && host !== "localhost") {
    return `http://${host}:3000`;
  }
  const devHost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${devHost}:3000`;
}
