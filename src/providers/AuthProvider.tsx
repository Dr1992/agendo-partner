import { useQueryClient } from "../hooks/api/reactQuery";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoadingCentered } from "../components/LoadingCentered";

import {
  clearAuthTokens,
  saveAuthTokens,
  type StoredAuthTokens,
} from "../auth/tokenStorage";
import { getValidStoredTokens } from "../auth/storedAccess";
import {
  fetchMe,
  isMeProfileComplete,
  logMeSnapshotForDev,
  mapMeToUserProfile,
  patchMe,
  type MeApiResponse,
} from "../api/public/me";
import type { AuthSession, UserProfile } from "../types/auth";
import { syncOwnerTeamPromoDismissWithPartnerEstablishments } from "../utils/ownerTeamPromoDismissedStorage";
import { isProfileComplete } from "../utils/validateUserProfile";

type SignInResult = {
  profileComplete: boolean;
};

type AuthContextValue = {
  cancelPendingSignIn: () => Promise<void>;
  completeRegistration: (profile: UserProfile) => Promise<void>;
  pendingSession: AuthSession | null;
  profile: UserProfile | null;
  profileComplete: boolean;
  refresh: () => Promise<void>;
  session: AuthSession | null;
  signIn: () => Promise<SignInResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildSession(
  tokens: StoredAuthTokens,
  me: MeApiResponse,
): AuthSession {
  return {
    accessToken: tokens.accessToken,
    displayNameFromProvider: me.fullName ?? me.name,
    email: me.email ?? "",
    expiresAtMs: tokens.expiresAtMs,
    provider: tokens.provider,
    refreshToken: tokens.refreshToken,
    userId: me.id,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const storedTokens = await getValidStoredTokens();
    if (!storedTokens) {
      setSession(null);
      setProfile(null);
      return;
    }
    try {
      const me = await fetchMe();
      await syncOwnerTeamPromoDismissWithPartnerEstablishments(me.id);
      setProfile(mapMeToUserProfile(me));
      setSession(buildSession(storedTokens, me));
    } catch {
      await clearAuthTokens();
      setSession(null);
      setProfile(null);
    }
  }, []);

  const sanitizeStoredAuth = useCallback(async () => {
    const storedTokens = await getValidStoredTokens();
    if (!storedTokens) {
      return;
    }
    try {
      await fetchMe();
    } catch {
      await clearAuthTokens();
      setSession(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await sanitizeStoredAuth();
      await refresh();
      setReady(true);
    })();
  }, [refresh, sanitizeStoredAuth]);

  const completeRegistration = useCallback(
    async (profile: UserProfile) => {
      const storedTokens = await getValidStoredTokens();
      if (!storedTokens) {
        throw new Error("Sessão expirada. Entre novamente.");
      }
      await patchMe(profile);
      await refresh();
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      await queryClient.invalidateQueries({
        queryKey: ["partner", "agenda-establishments"],
      });
    },
    [queryClient, refresh],
  );

  const signIn = useCallback(async (): Promise<SignInResult> => {
    const { signInWithAuth0 } = await import("../auth/auth0Login");
    const tokens = await signInWithAuth0();
    const expiresAtMs = Date.now() + (tokens.expiresIn - 60) * 1000;
    const stored: StoredAuthTokens = {
      accessToken: tokens.accessToken,
      expiresAtMs,
      idToken: tokens.idToken,
      provider: "google",
      refreshToken: tokens.refreshToken,
    };
    await saveAuthTokens(stored);
    const me = await fetchMe();
    await syncOwnerTeamPromoDismissWithPartnerEstablishments(me.id);
    logMeSnapshotForDev(me, "Login");
    const profileComplete = isMeProfileComplete(me);
    setProfile(mapMeToUserProfile(me));
    setSession(buildSession(stored, me));
    await queryClient.invalidateQueries({ queryKey: ["customer"] });
    await queryClient.invalidateQueries({ queryKey: ["partner"] });
    await queryClient.invalidateQueries({
      queryKey: ["partner", "agenda-establishments"],
    });
    return { profileComplete };
  }, [queryClient]);

  const cancelPendingSignIn = useCallback(async () => {
    await clearAuthTokens();
    setSession(null);
    setProfile(null);
    queryClient.removeQueries({ queryKey: ["customer"] });
    await queryClient.invalidateQueries({ queryKey: ["partner"] });
  }, [queryClient]);

  const signOut = useCallback(async () => {
    await clearAuthTokens();
    setSession(null);
    setProfile(null);
    queryClient.removeQueries({ queryKey: ["customer"] });
    await queryClient.invalidateQueries({ queryKey: ["partner"] });
  }, [queryClient]);

  const profileComplete = isProfileComplete(profile);

  const value = useMemo(
    (): AuthContextValue => ({
      cancelPendingSignIn,
      completeRegistration,
      pendingSession: null,
      profile,
      profileComplete,
      refresh,
      session,
      signIn,
      signOut,
    }),
    [
      cancelPendingSignIn,
      completeRegistration,
      profile,
      profileComplete,
      refresh,
      session,
      signIn,
      signOut,
    ],
  );

  if (!ready) {
    return <LoadingCentered />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
