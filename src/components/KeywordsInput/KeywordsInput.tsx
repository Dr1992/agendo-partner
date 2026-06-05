import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import { getScreenFormStyles } from "../ScreenForm";
import { palette } from "../../theme/colors";
import { Text } from "../Text";

import { getKeywordsInputStyles } from "./styles";

/** Limite alinhado ao backend (`ArrayMaxSize(20)`). */
const DEFAULT_MAX_KEYWORDS = 20;
/** Comprimento máximo por palavra-chave, alinhado ao backend (`Length/MaxLength 40`). */
const MAX_KEYWORD_LENGTH = 40;

type KeywordsInputProps = {
  value: readonly string[];
  onChange: (keywords: string[]) => void;
  /** Rótulo acessível do botão de remover cada chip (texto traduzido). */
  removeAccessibilityLabel: string;
  placeholder?: string;
  disabled?: boolean;
  maxKeywords?: number;
};

/**
 * Entrada de palavras-chave (descoberta na busca, KAN-10): o utilizador digita e
 * confirma cada palavra com Enter, vírgula ou botão +. Normaliza para minúsculas,
 * apara e remove duplicadas — espelhando a normalização do backend.
 */
export function KeywordsInput({
  value,
  onChange,
  removeAccessibilityLabel,
  placeholder,
  disabled,
  maxKeywords = DEFAULT_MAX_KEYWORDS,
}: KeywordsInputProps) {
  const { theme } = useAppTheme();
  const formStyles = getScreenFormStyles(theme);
  const styles = getKeywordsInputStyles(theme);
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const atLimit = value.length >= maxKeywords;

  const commitDraft = (raw: string) => {
    const keyword = raw.trim().toLowerCase().slice(0, MAX_KEYWORD_LENGTH);
    if (keyword.length === 0) {
      setDraft("");
      return;
    }
    if (atLimit || value.some((existing) => existing === keyword)) {
      setDraft("");
      return;
    }
    onChange([...value, keyword]);
    setDraft("");
  };

  const handleChangeText = (text: string) => {
    // Vírgula confirma a palavra-chave, além da tecla de envio do teclado.
    if (text.includes(",")) {
      const [first] = text.split(",");
      commitDraft(first);
      return;
    }
    setDraft(text);
  };

  const removeKeyword = (keyword: string) => {
    onChange(value.filter((existing) => existing !== keyword));
  };

  const showAddButton = focused && !atLimit && !disabled;

  return (
    <View>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
          editable={!disabled && !atLimit}
          placeholder={placeholder}
          placeholderTextColor={theme.textHint}
          returnKeyType="done"
          style={[formStyles.field, styles.inputField]}
          value={draft}
          onBlur={() => setFocused(false)}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onSubmitEditing={(event) => commitDraft(event.nativeEvent.text)}
        />
        {showAddButton ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
            onPress={() => {
              commitDraft(draft);
              inputRef.current?.focus();
            }}
          >
            <Ionicons color={palette.onAccent} name="add" size={22} />
          </Pressable>
        ) : null}
      </View>
      {value.length > 0 ? (
        <View style={styles.chips}>
          {value.map((keyword) => (
            <View key={keyword} style={styles.chip}>
              <Text style={styles.chipText} variant="caption">
                {keyword}
              </Text>
              <Pressable
                accessibilityLabel={removeAccessibilityLabel}
                accessibilityRole="button"
                disabled={disabled}
                hitSlop={8}
                onPress={() => removeKeyword(keyword)}
              >
                <Ionicons color={theme.accent} name="close" size={15} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
