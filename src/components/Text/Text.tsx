import type { ReactNode } from "react";
import { Text as RNText, type TextProps } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";

import { getTextStyles } from "./styles";

export type TextVariant =
  | "body"
  | "bodyTight"
  | "caption"
  | "ctaOutline"
  | "ctaPrimary"
  | "fieldLabel"
  | "formSelectPlaceholder"
  | "formSelectValue"
  | "hint"
  | "linkAccent"
  | "linkMuted"
  | "listSubtitle"
  | "listTitle"
  | "title";

type TextComponentProps = TextProps & {
  children: ReactNode;
  variant: TextVariant;
};

export function Text({
  children,
  style,
  variant,
  ...rest
}: TextComponentProps) {
  const { theme } = useAppTheme();
  const variantStyles = getTextStyles(theme);
  return (
    <RNText style={[variantStyles[variant], style]} {...rest}>
      {children}
    </RNText>
  );
}
