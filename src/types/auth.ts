export type AuthProviderId = "google";

export type AuthSession = {
  email: string;
  provider: AuthProviderId;
  /** ID interno do usuário (UUID) vindo de GET /me */
  userId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAtMs: number;
  /** Nome parcial vindo do IdP / perfil. */
  displayNameFromProvider?: string | null;
};

export type UserProfile = {
  cpf: string;
  email: string;
  fullName: string;
  phone: string;
};
