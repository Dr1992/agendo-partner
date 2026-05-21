import { useEffect } from "react";

import { PartnerMainTabNavigator } from "./navigators/PartnerMainTabNavigator";
import {
  AppProviders,
  ThemedNavigationContainer,
} from "./providers/AppProviders";
import { AuthProvider } from "./providers/AuthProvider";

export default function App() {
  useEffect(() => {
    void (async () => {
      try {
        const WebBrowser = await import("expo-web-browser");
        WebBrowser.maybeCompleteAuthSession();
      } catch {
        /* Nativo ausente ou build desatualizado */
      }
    })();
  }, []);

  return (
    <AppProviders>
      <ThemedNavigationContainer>
        <AuthProvider>
          <PartnerMainTabNavigator />
        </AuthProvider>
      </ThemedNavigationContainer>
    </AppProviders>
  );
}
