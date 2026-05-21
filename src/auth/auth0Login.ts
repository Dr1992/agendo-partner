import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";
import type { AuthSessionResult } from "expo-auth-session";

import {
  getAuth0Audience,
  getAuth0ClientId,
  getAuth0Domain,
} from "../config/auth0Env";

function authDebug(label: string, payload: unknown): void {
  if (__DEV__) {
    console.warn(
      `[Auth0] ${label}`,
      typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
    );
  }
}

/**
 * Redirect URI no formato que o Auth0 aceita para apps nativos (Quickstart RN).
 * Ex.: com.agendo.app.auth0://SEU-TENANT.us.auth0.com/ios/com.agendo.app/callback
 * Incluir **as duas** linhas (iOS + Android) em Allowed Callback URLs e Logout URLs.
 */
function buildAuth0NativeRedirectUri(): string {
  const auth0Host = getAuth0Domain();
  const bundle =
    Platform.OS === "ios"
      ? (Constants.expoConfig?.ios?.bundleIdentifier ?? "com.agendo.app")
      : (Constants.expoConfig?.android?.package ?? "com.agendo.app");
  const scheme = `${bundle}.auth0`;
  const segment = Platform.OS === "android" ? "android" : "ios";
  return `${scheme}://${auth0Host}/${segment}/${bundle}/callback`;
}

function describePromptFailure(result: AuthSessionResult): string {
  if (result.type === "cancel") {
    return "Login cancelado.";
  }
  if (result.type === "dismiss") {
    return "A janela de login foi fechada antes de concluir.";
  }
  if (result.type === "opened" || result.type === "locked") {
    return "Nao foi possivel concluir o login.";
  }
  if (result.type !== "success" && result.type !== "error") {
    return "Login não concluído.";
  }

  const params = result.params;
  if (params.error) {
    const raw = params.error_description ?? "";
    const desc = raw ? decodeURIComponent(raw.replace(/\+/g, " ")) : "";
    return desc ? `${params.error}: ${desc}` : params.error;
  }
  if (result.type === "error" && result.error) {
    return result.error.message ?? "Nao foi possivel concluir o login.";
  }
  if (!params.code) {
    return "Nao foi possivel concluir o login agora. Tente novamente.";
  }
  return "Login não concluído.";
}

export type Auth0TokenSet = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  idToken?: string;
};

/**
 * Login Auth0. Carrega `expo-auth-session` e `expo-web-browser` só aqui para o
 * binário nativo não ser exigido no arranque (útil até reconstruir o dev client).
 */
export async function signInWithAuth0(): Promise<Auth0TokenSet> {
  const WebBrowser = await import("expo-web-browser");
  WebBrowser.maybeCompleteAuthSession();
  const AuthSession = await import("expo-auth-session");

  const useFixedNativeRedirect =
    Platform.OS !== "web" &&
    (Constants.executionEnvironment === ExecutionEnvironment.Standalone ||
      Constants.executionEnvironment === ExecutionEnvironment.Bare);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "agendo",
    path: "redirect",
    native: useFixedNativeRedirect ? buildAuth0NativeRedirectUri() : undefined,
  });

  authDebug("redirect_uri (deve estar nas Callback URLs)", redirectUri);
  authDebug("connection", "google-oauth2");

  const domain = getAuth0Domain();
  const discovery = await AuthSession.fetchDiscoveryAsync(`https://${domain}`);
  const request = new AuthSession.AuthRequest({
    clientId: getAuth0ClientId(),
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    scopes: ["openid", "profile", "email", "offline_access"],
    usePKCE: true,
    extraParams: {
      audience: getAuth0Audience(),
      connection: "google-oauth2",
      // Pede seletor de conta (evita entrar direto na ultima conta usada).
      prompt: "select_account",
      // Preferencia de idioma para telas suportadas pelo provedor.
      ui_locales: "pt-BR",
    },
  });

  const result = await request.promptAsync(discovery);
  authDebug("promptAsync resultado (type + params)", {
    type: result.type,
    params:
      result.type === "success" || result.type === "error"
        ? result.params
        : undefined,
    error:
      result.type === "error"
        ? (result.error?.message ?? result.error)
        : undefined,
    url:
      result.type === "success" || result.type === "error"
        ? result.url
        : undefined,
  });

  if (result.type !== "success" || !result.params.code) {
    throw new Error(describePromptFailure(result));
  }

  try {
    const tokenRes = await AuthSession.exchangeCodeAsync(
      {
        clientId: getAuth0ClientId(),
        code: result.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier ?? "",
          // Auth0: sem isto o access token pode vir só para /userinfo e o Nest rejeita (401).
          audience: getAuth0Audience(),
        },
      },
      discovery,
    );

    return {
      accessToken: tokenRes.accessToken,
      expiresIn: tokenRes.expiresIn ?? 3600,
      idToken: tokenRes.idToken,
      refreshToken: tokenRes.refreshToken,
    };
  } catch (e) {
    authDebug("exchangeCodeAsync falhou", e instanceof Error ? e.message : e);
    throw e instanceof Error
      ? e
      : new Error("Falha ao trocar o código por tokens.");
  }
}
