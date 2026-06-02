import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import { ProfileStack } from "../../../navigation/routeIds";
import { useAuth } from "../../../providers/AuthProvider";

export function usePartnerHomeRules(
  navigation: ProfileScreenProps<"PartnerHome">["navigation"],
) {
  const { profileComplete, session, signIn } = useAuth();
  const { t } = useTranslation("partner");
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
        title: t("home.loginErrorTitle"),
        message:
          e instanceof Error ? e.message : t("home.loginErrorFallback"),
      });
    }
  }, [navigation, signIn, t]);

  const showFixedRegisterButton = Boolean(session && profileComplete);

  return {
    dismissLoginError,
    loginError,
    onLogin,
    showFixedRegisterButton,
  };
}
