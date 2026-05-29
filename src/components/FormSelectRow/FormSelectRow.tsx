import { Ionicons } from "@expo/vector-icons";
import { Pressable, type ViewStyle } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";

import { Text } from "../Text/Text";

import { getFormSelectRowStyles } from "./styles";

type Chevron = "down" | "forward";

type FormSelectRowProps = {
  chevron?: Chevron;
  disabled?: boolean;
  displayText: string;
  empty: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export function FormSelectRow({
  chevron = "down",
  disabled,
  displayText,
  empty,
  onPress,
  style,
}: FormSelectRowProps) {
  const { theme } = useAppTheme();
  const styles = getFormSelectRowStyles(theme);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.pressable,
        disabled && styles.pressableDisabled,
        pressed && !disabled && styles.pressablePressed,
        style,
      ]}
      onPress={onPress}
    >
      <Text variant={empty ? "formSelectPlaceholder" : "formSelectValue"}>
        {displayText}
      </Text>
      <Ionicons
        color={theme.textHint}
        name={chevron === "down" ? "chevron-down" : "chevron-forward"}
        size={22}
      />
    </Pressable>
  );
}
