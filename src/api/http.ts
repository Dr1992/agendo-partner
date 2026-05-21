import { getValidStoredTokens } from "../auth/storedAccess";
import { getApiBaseUrl } from "../config/apiBaseUrl";

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/v1${normalizedPath}`;
}

async function readErrorMessage(res: Response): Promise<string> {
  const clone = res.clone();
  try {
    const errorJson: unknown = await res.json();
    if (
      typeof errorJson === "object" &&
      errorJson !== null &&
      "message" in errorJson &&
      typeof (errorJson as { message: unknown }).message === "string"
    ) {
      return (errorJson as { message: string }).message;
    }
  } catch {
    /* fall through */
  }
  try {
    const responseText = await clone.text();
    if (responseText) {
      return responseText.slice(0, 240);
    }
  } catch {
    /* ignore */
  }
  return `HTTP ${res.status}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

async function authHeaders(): Promise<HeadersInit> {
  const tokens = await getValidStoredTokens();
  if (!tokens?.accessToken) {
    throw new Error("Não autenticado");
  }
  return {
    Accept: "application/json",
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

/** Para `multipart/form-data` — não definir `Content-Type` (boundary automático). */
async function authHeadersMultipart(): Promise<HeadersInit> {
  const tokens = await getValidStoredTokens();
  if (!tokens?.accessToken) {
    throw new Error("Não autenticado");
  }
  return {
    Accept: "application/json",
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

export async function apiAuthGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

export async function apiAuthPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: {
      ...(await authHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

export async function apiAuthPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "PUT",
    headers: {
      ...(await authHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

export async function apiAuthPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "PATCH",
    headers: {
      ...(await authHeaders()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

export async function apiAuthDelete<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  return undefined as T;
}

export async function apiAuthPostMultipart<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: await authHeadersMultipart(),
    body: formData,
  });
  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }
  return res.json() as Promise<T>;
}
