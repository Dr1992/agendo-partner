import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import { palette } from "../../theme/colors";
import { getScreenFormStyles } from "../ScreenForm";

import { Text } from "../Text/Text";

type ButtonVariant = "outline" | "primary";

type ButtonProps = Omit<PressableProps, "children"> & {
  children: string;
  loading?: boolean;
  variant?: ButtonVariant;
};

export function Button({
  children,
  disabled,
  loading,
  style,
  variant = "primary",
  ...pressableProps
}: ButtonProps) {
  const { theme } = useAppTheme();
  const styles = getScreenFormStyles(theme);
  const isPrimary = variant === "primary";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => {
        const row: StyleProp<ViewStyle>[] = [
          isPrimary ? styles.cta : styles.ctaOutline,
        ];
        if (disabled || loading) {
          row.push(styles.ctaDisabled);
        } else if (pressed) {
          row.push(styles.interactionPressed);
        }
        if (style != null && typeof style !== "function") {
          row.push(style);
        }
        return row;
      }}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? palette.onAccent : theme.textPrimary}
        />
      ) : (
        <Text variant={isPrimary ? "ctaPrimary" : "ctaOutline"}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
