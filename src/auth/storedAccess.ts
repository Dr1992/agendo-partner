import { refreshAuth0AccessToken } from "./refreshAuth0";
import {
  clearAuthTokens,
  loadAuthTokens,
  saveAuthTokens,
  type StoredAuthTokens,
} from "./tokenStorage";

/** Margem antes do fim da validade para renovar o access token (ms) */
const EXPIRY_SKEW_MS = 90_000;

/** Segundos a descontar da validade declarada ao gravar `expiresAtMs` */
const EXPIRES_IN_BUFFER_SEC = 60;

let refreshPromise: Promise<StoredAuthTokens | null> | null = null;

async function refreshStoredTokens(
  previous: StoredAuthTokens,
): Promise<StoredAuthTokens | null> {
  if (!previous.refreshToken) {
    await clearAuthTokens();
    return null;
  }
  try {
    const next = await refreshAuth0AccessToken(previous.refreshToken);
    const stored: StoredAuthTokens = {
      accessToken: next.accessToken,
      expiresAtMs:
        Date.now() +
        Math.max(30, next.expiresIn - EXPIRES_IN_BUFFER_SEC) * 1000,
      idToken: next.idToken ?? previous.idToken,
      provider: previous.provider,
      refreshToken: next.refreshToken ?? previous.refreshToken,
    };
    await saveAuthTokens(stored);
    return stored;
  } catch {
    await clearAuthTokens();
    return null;
  }
}

/**
 * Lê tokens do armazenamento e renova o access token com refresh_token quando
 * estiver perto de expirar.
 */
export async function getValidStoredTokens(): Promise<StoredAuthTokens | null> {
  const stored = await loadAuthTokens();
  if (!stored) {
    return null;
  }
  if (stored.expiresAtMs > Date.now() + EXPIRY_SKEW_MS) {
    return stored;
  }
  if (!stored.refreshToken) {
    await clearAuthTokens();
    return null;
  }
  if (!refreshPromise) {
    refreshPromise = refreshStoredTokens(stored).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
