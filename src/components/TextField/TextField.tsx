import { TextInput, type TextInputProps, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import { getScreenFormStyles } from "../ScreenForm";

import { Text } from "../Text/Text";

import { getTextFieldStyles } from "./styles";

type TextFieldProps = TextInputProps & {
  label?: string;
  showCharCount?: boolean;
};

export function TextField({
  label,
  showCharCount,
  style,
  ...inputProps
}: TextFieldProps) {
  const { theme } = useAppTheme();
  const styles = getScreenFormStyles(theme);
  const tf = getTextFieldStyles(theme);
  const maxLength =
    typeof inputProps.maxLength === "number" ? inputProps.maxLength : undefined;
  const length = String(inputProps.value ?? "").length;
  const showCounter = Boolean(showCharCount && maxLength != null);

  return (
    <View>
      {label ? <Text variant="fieldLabel">{label}</Text> : null}
      <TextInput
        placeholderTextColor={theme.textHint}
        style={[styles.field, style]}
        {...inputProps}
      />
      {showCounter && maxLength != null ? (
        <Text
          variant="caption"
          style={[tf.charCount, length >= maxLength ? tf.charCountLimit : null]}
        >
          {length} / {maxLength}
        </Text>
      ) : null}
    </View>
  );
}
