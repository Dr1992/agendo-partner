function req(name: string, rawValue: string | undefined): string {
  const trimmed = rawValue?.trim();
  if (!trimmed) {
    throw new Error(`${name} não configurado (veja app/.env.example).`);
  }
  return trimmed;
}

export function getAuth0Domain(): string {
  const raw = req(
    "EXPO_PUBLIC_AUTH0_DOMAIN",
    process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
  );
  return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getAuth0ClientId(): string {
  return req(
    "EXPO_PUBLIC_AUTH0_CLIENT_ID",
    process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
  );
}

export function getAuth0Audience(): string {
  return req(
    "EXPO_PUBLIC_AUTH0_AUDIENCE",
    process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
  );
}
