import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Platform, Switch, TextInput, View } from "react-native";

import { AppSheetModal } from "../AppSheetModal/AppSheetModal";
import { Button } from "../Button";
import { Text } from "../Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { Professional } from "../../types/professional";

import { getServicePerformersModalStyles } from "./styles";

function staffRoleKey(
  role: string | undefined,
): "roleCollaborator" | "roleManager" {
  if (role === "MANAGER") {
    return "roleManager";
  }
  return "roleCollaborator";
}

export type ServicePerformersModalProps = {
  initialSelected: ReadonlySet<string>;
  onApply: (selected: Set<string>) => void;
  onClose: () => void;
  professionals: Professional[];
  visible: boolean;
};

export function ServicePerformersModal({
  initialSelected,
  onApply,
  onClose,
  professionals,
  visible,
}: ServicePerformersModalProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation("components");
  const styles = useMemo(() => getServicePerformersModalStyles(theme), [theme]);

  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (visible) {
      setDraft(new Set(initialSelected));
      setQuery("");
    }
  }, [initialSelected, visible]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return professionals;
    }
    return professionals.filter((pro) =>
      pro.name.toLowerCase().includes(needle),
    );
  }, [professionals, query]);

  const toggle = (id: string, value: boolean) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (value) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const onConfirm = () => {
    onApply(new Set(draft));
    onClose();
  };

  return (
    <AppSheetModal
      footer={
        <Button onPress={onConfirm}>{t("servicePerformers.done")}</Button>
      }
      size="large"
      title={t("servicePerformers.title")}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.bodyColumn}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          {...(Platform.OS === "ios"
            ? { clearButtonMode: "while-editing" as const }
            : {})}
          placeholder={t("servicePerformers.searchPlaceholder")}
          placeholderTextColor={theme.textHint}
          style={styles.searchField}
          value={query}
          onChangeText={setQuery}
        />
        <FlatList
          contentContainerStyle={styles.listContent}
          data={filtered}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          removeClippedSubviews={false}
          style={styles.listFlex}
          ListEmptyComponent={
            <Text style={styles.subHint} variant="hint">
              {t("servicePerformers.empty")}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowLabel}>
                <Text variant="bodyTight">{item.name}</Text>
                <Text style={styles.subHint} variant="hint">
                  {t(`servicePerformers.${staffRoleKey(item.staffRole)}`)}
                </Text>
              </View>
              <View style={styles.switchWrap}>
                <Switch
                  thumbColor={theme.surface}
                  trackColor={{
                    false: theme.border,
                    true: theme.accent,
                  }}
                  value={draft.has(item.id)}
                  onValueChange={(v) => toggle(item.id, v)}
                />
              </View>
            </View>
          )}
        />
      </View>
    </AppSheetModal>
  );
}
