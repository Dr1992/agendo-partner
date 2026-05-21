import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppSheetModal } from "../AppSheetModal/AppSheetModal";
import { Button } from "../Button";
import { useAppTheme } from "../../hooks/useAppTheme";
import { getScreenFormStyles } from "../ScreenForm";
import { cloneOpeningSchedule, type DaySlot } from "../../utils/openingHours";
import { OpeningHoursEditor } from "./OpeningHoursEditor";
import { getOpeningHoursEditorModalStyles } from "./styles";

type OpeningHoursEditorModalProps = {
  /** Título do cabeçalho (ex.: disponibilidade do colaborador). */
  modalTitle?: string;
  onChange: (next: DaySlot[]) => void;
  /** Chamado ao tocar em «Concluir», depois de aplicar o rascunho ao formulário (ex.: marcar horários como revistos). */
  onConfirm?: () => void;
  onClose: () => void;
  value: DaySlot[];
  visible: boolean;
};

export function OpeningHoursEditorModal({
  modalTitle = "Horário de funcionamento",
  onChange,
  onConfirm,
  onClose,
  value,
  visible,
}: OpeningHoursEditorModalProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const formStyles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const layout = useMemo(
    () =>
      getOpeningHoursEditorModalStyles(theme, {
        bottom: insets.bottom,
      }),
    [insets.bottom, theme],
  );

  const [draft, setDraft] = useState<DaySlot[]>(() =>
    cloneOpeningSchedule(value),
  );
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      setDraft(cloneOpeningSchedule(value));
    }
    wasVisibleRef.current = visible;
  }, [value, visible]);

  const handleConfirm = useCallback(() => {
    onChange(draft);
    onConfirm?.();
    onClose();
  }, [draft, onChange, onConfirm, onClose]);

  const footer = useMemo(
    () => (
      <Button style={formStyles.ctaModalFooter} onPress={handleConfirm}>
        Concluir
      </Button>
    ),
    [formStyles.ctaModalFooter, handleConfirm],
  );

  return (
    <AppSheetModal
      contentPaddingH={20}
      footer={footer}
      size="large"
      title={modalTitle}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={layout.bodyWrap}>
        <ScrollView
          contentContainerStyle={layout.scrollContent}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={layout.scroll}
        >
          <OpeningHoursEditor value={draft} onChange={setDraft} />
        </ScrollView>
      </View>
    </AppSheetModal>
  );
}
