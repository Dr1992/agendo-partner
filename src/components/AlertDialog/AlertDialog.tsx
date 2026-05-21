import { useAtom, useSetAtom } from "jotai";
import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { rootAlertDialogAtom } from "../../atoms/rootAlertDialogAtom";
import { useAppTheme } from "../../hooks/useAppTheme";

import type { AlertDialogButton } from "./AlertDialog.types";
import { getAlertDialogStyles } from "./styles";

export type { AlertDialogButton } from "./AlertDialog.types";

type AlertDialogProps = {
  buttons: AlertDialogButton[];
  message: string;
  onRequestClose: () => void;
  title: string;
  visible: boolean;
};

let rootAlertSerial = 1;

/** Conteúdo visual do alerta (sem `Modal`) — útil como overlay dentro de outro modal no Android. */
export function AlertDialogSurface({
  buttons,
  message,
  onRequestClose,
  title,
}: Omit<AlertDialogProps, "visible">) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getAlertDialogStyles(theme), [theme]);
  const single = buttons.length === 1;

  return (
    <View style={styles.backdrop}>
      <Pressable
        accessibilityRole="button"
        style={StyleSheet.absoluteFillObject}
        onPress={onRequestClose}
      />
      <View accessibilityRole="none" style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {single ? (
          <Pressable
            accessibilityRole="button"
            style={[
              styles.btn,
              styles.btnSingle,
              buttons[0]!.variant === "primary" && styles.btnPrimary,
              buttons[0]!.variant === "secondary" && styles.btnSecondary,
              buttons[0]!.variant === "destructive" && styles.btnDestructive,
            ]}
            onPress={() => {
              buttons[0]!.onPress();
            }}
          >
            <Text
              style={
                buttons[0]!.variant === "destructive"
                  ? styles.btnDestructiveText
                  : buttons[0]!.variant === "secondary"
                    ? styles.btnSecondaryText
                    : styles.btnPrimaryText
              }
            >
              {buttons[0]!.label}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.actionsRow}>
            {buttons.map((b) => (
              <Pressable
                key={b.buttonKey ?? b.label}
                accessibilityRole="button"
                style={[
                  styles.btn,
                  b.variant === "primary" && styles.btnPrimary,
                  b.variant === "secondary" && styles.btnSecondary,
                  b.variant === "destructive" && styles.btnDestructive,
                ]}
                onPress={() => {
                  b.onPress();
                }}
              >
                <Text
                  style={
                    b.variant === "destructive"
                      ? styles.btnDestructiveText
                      : b.variant === "primary"
                        ? styles.btnPrimaryText
                        : styles.btnSecondaryText
                  }
                >
                  {b.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Alerta acima do conteúdo **no mesmo** `Modal` (ex.: `AppSheetModal`). No Android, um segundo
 * `Modal` nativo costuma ficar por baixo do primeiro; use isto em fluxos com sheet aberto.
 */
export function AlertDialogInlineOverlay({
  buttons,
  message,
  onRequestClose,
  title,
  visible,
}: AlertDialogProps) {
  if (!visible) {
    return null;
  }
  return (
    <View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFillObject,
        { zIndex: 1000 },
        Platform.OS === "android" ? { elevation: 24 } : null,
      ]}
    >
      <AlertDialogSurface
        buttons={buttons}
        message={message}
        title={title}
        onRequestClose={onRequestClose}
      />
    </View>
  );
}

/**
 * Um único `Modal` na raiz da app para que alertas fiquem acima de outros modais/sheets
 * (stack de `Modal` no Android costuma falhar quando há dois níveis).
 */
export function RootAlertDialogHost() {
  const [state] = useAtom(rootAlertDialogAtom);
  const visible = state !== null;

  return (
    <Modal
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent={Platform.OS === "android"}
      transparent
      visible={visible}
      onRequestClose={() => {
        state?.onRequestClose();
      }}
    >
      {state ? (
        <AlertDialogSurface
          buttons={state.buttons}
          message={state.message}
          title={state.title}
          onRequestClose={state.onRequestClose}
        />
      ) : null}
    </Modal>
  );
}

/**
 * API declarativa: não abre um `Modal` local — regista no átomo global para o
 * {@link RootAlertDialogHost} renderizar por cima de qualquer outro modal.
 */
export function AlertDialog({
  buttons,
  message,
  onRequestClose,
  title,
  visible,
}: AlertDialogProps) {
  const setRoot = useSetAtom(rootAlertDialogAtom);
  const requestIdRef = useRef(0);

  useLayoutEffect(() => {
    if (!visible) {
      const rid = requestIdRef.current;
      if (rid !== 0) {
        setRoot((s) => (s?.requestId === rid ? null : s));
        requestIdRef.current = 0;
      }
      return;
    }
    const rid =
      requestIdRef.current !== 0
        ? requestIdRef.current
        : (requestIdRef.current = rootAlertSerial++);
    setRoot({
      requestId: rid,
      title,
      message,
      buttons,
      onRequestClose: () => {
        onRequestClose();
        setRoot((s) => (s?.requestId === rid ? null : s));
      },
    });
  }, [visible, title, message, buttons, onRequestClose, setRoot]);

  useLayoutEffect(() => {
    return () => {
      const rid = requestIdRef.current;
      if (rid !== 0) {
        setRoot((s) => (s?.requestId === rid ? null : s));
        requestIdRef.current = 0;
      }
    };
  }, [setRoot]);

  return null;
}
