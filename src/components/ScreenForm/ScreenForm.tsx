import type { ReactNode } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../../hooks/useAppTheme";

import { getScreenFormStyles } from "./styles";

export { getScreenFormStyles } from "./styles";

type ScreenFormScrollProps = {
  children: ReactNode;
};

/**
 * Layout padrão (SafeArea + Scroll + padding de formulário).
 * Os tokens em `styles.ts` pertencem a este componente; outras telas podem
 * usar `getScreenFormStyles` quando precisarem dos mesmos estilos fora deste layout.
 */
export function ScreenFormScroll({ children }: ScreenFormScrollProps) {
  const { theme } = useAppTheme();
  const layoutStyles = getScreenFormStyles(theme);
  return (
    <SafeAreaView edges={[]} style={layoutStyles.container}>
      <ScrollView
        contentContainerStyle={layoutStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={layoutStyles.scroll}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
