import { useCallback, useState } from "react";

import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import { ProfileStack } from "../../../navigation/routeIds";
import { useAuth } from "../../../providers/AuthProvider";

export function usePartnerHomeRules(
  navigation: ProfileScreenProps<"PartnerHome">["navigation"],
) {
  const { profileComplete, session, signIn } = useAuth();
  const [loginError, setLoginError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const dismissLoginError = useCallback(() => {
    setLoginError(null);
  }, []);

  const onLogin = useCallback(async () => {
    try {
      const signInResult = await signIn();
      if (!signInResult.profileComplete) {
        navigation.navigate(ProfileStack.CompleteProfile);
      }
    } catch (e) {
      setLoginError({
        title: "Login",
        message:
          e instanceof Error ? e.message : "Nao foi possivel concluir o login.",
      });
    }
  }, [navigation, signIn]);

  const showFixedRegisterButton = Boolean(session && profileComplete);

  return {
    dismissLoginError,
    loginError,
    onLogin,
    showFixedRegisterButton,
  };
}
