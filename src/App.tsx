import { useEffect } from "react";

import "./i18n";
import { useLocale } from "./i18n/useLocale";
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
      <AppGate />
    </AppProviders>
  );
}

function AppGate() {
  useLocale();

  return (
    <ThemedNavigationContainer>
      <AuthProvider>
        <PartnerMainTabNavigator />
      </AuthProvider>
    </ThemedNavigationContainer>
  );
}
