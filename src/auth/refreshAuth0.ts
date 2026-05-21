import {
  getAuth0Audience,
  getAuth0ClientId,
  getAuth0Domain,
} from "../config/auth0Env";
import type { Auth0TokenSet } from "./auth0Login";

type TokenEndpointResponse = {
  access_token: string;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
};

export async function refreshAuth0AccessToken(
  refreshToken: string,
): Promise<Auth0TokenSet> {
  const domain = getAuth0Domain();
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: getAuth0ClientId(),
      refresh_token: refreshToken,
      audience: getAuth0Audience(),
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(raw.slice(0, 200) || `Refresh falhou (HTTP ${res.status})`);
  }
  let j: TokenEndpointResponse;
  try {
    j = JSON.parse(raw) as TokenEndpointResponse;
  } catch {
    throw new Error("Resposta inválida ao renovar sessão.");
  }
  return {
    accessToken: j.access_token,
    expiresIn: j.expires_in ?? 3600,
    idToken: j.id_token,
    refreshToken: j.refresh_token,
  };
}
