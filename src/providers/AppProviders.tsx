import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  NavigationContainer,
  type Theme as NavigationTheme,
} from "@react-navigation/native";

import { rootNavigationRef } from "../navigation/rootNavigationRef";
import { QueryClient, QueryClientProvider } from "../hooks/api/reactQuery";
import { Provider as JotaiProvider } from "jotai";
import { type ReactNode, useCallback, useMemo } from "react";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { StatusBar } from "react-native";

import { RootAlertDialogHost } from "../components/AlertDialog/AlertDialog";
import { useAppTheme } from "../hooks/useAppTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          {children}
          <RootAlertDialogHost />
        </SafeAreaProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

export function ThemedNavigationContainer({ children }: AppProvidersProps) {
  const { theme, resolvedScheme } = useAppTheme();

  const applyStatusBar = useCallback(() => {
    setTimeout(() => {
      StatusBar.setBarStyle(
        resolvedScheme === "light" ? "dark-content" : "light-content",
        true,
      );
      StatusBar.setBackgroundColor(theme.background, true);
    }, 50);
  }, [resolvedScheme, theme]);

  const navigationTheme = useMemo((): NavigationTheme => {
    const base = resolvedScheme === "dark" ? NavDarkTheme : NavDefaultTheme;

    applyStatusBar();

    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.background,
        border: theme.tabBarBorder,
        card: theme.tabBar,
        notification: theme.accent,
        primary: theme.accent,
        text: theme.textPrimary,
      },
    };
  }, [applyStatusBar, resolvedScheme, theme]);

  return (
    <NavigationContainer
      ref={rootNavigationRef}
      theme={navigationTheme}
      onStateChange={applyStatusBar}
    >
      {children}
    </NavigationContainer>
  );
}
