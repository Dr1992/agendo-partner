import { useAuth } from "../../../providers/AuthProvider";

export function usePartnerHomeRules() {
  const { profileComplete, session } = useAuth();

  const showFixedRegisterButton = Boolean(session && profileComplete);

  return {
    showFixedRegisterButton,
  };
}
