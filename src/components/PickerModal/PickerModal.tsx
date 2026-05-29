import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useMemo } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { AppSheetModal } from "../AppSheetModal/AppSheetModal";
import { useAppTheme } from "../../hooks/useAppTheme";

import { getPickerModalStyles } from "./styles";

type PickerModalProps<T> = {
  footer?: ReactNode;
  /** `slide` anima a folha de baixo para cima (comum em seletores). */
  modalAnimation?: "fade" | "slide";
  items: T[];
  keyExtractor: (item: T) => string;
  onClose: () => void;
  onSelectItem: (item: T) => void;
  renderItem: (item: T) => { subtitle?: string; title: string };
  title: string;
  visible: boolean;
};

export function PickerModal<T>({
  footer,
  modalAnimation = "fade",
  items,
  keyExtractor,
  onClose,
  onSelectItem,
  renderItem,
  title,
  visible,
}: PickerModalProps<T>) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getPickerModalStyles(theme), [theme]);
  const { height: windowH } = useWindowDimensions();
  const sheetMaxH = Math.min(windowH * 0.78, 560);

  return (
    <AppSheetModal
      animationType={modalAnimation}
      footer={footer ? <View style={styles.footer}>{footer}</View> : undefined}
      maxHeightPx={sheetMaxH}
      title={title}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.listOuter}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          style={styles.listFill}
          renderItem={({ item }) => {
            const row = renderItem(item);
            return (
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => {
                  onSelectItem(item);
                  onClose();
                }}
              >
                <View style={styles.rowTextCol}>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  {row.subtitle ? (
                    <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
                  ) : null}
                </View>
                <Ionicons
                  color={theme.textHint}
                  name="chevron-forward"
                  size={20}
                />
              </Pressable>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </AppSheetModal>
  );
}
