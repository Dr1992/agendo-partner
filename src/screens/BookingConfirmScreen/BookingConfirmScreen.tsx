import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { DetailFactsCard } from "../../components/DetailFactsCard/DetailFactsCard";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useBookingConfirmScreen } from "./hooks/useBookingConfirmScreen";
import { getBookingConfirmStyles } from "./styles";
import type { BookingConfirmScreenProps } from "./types";

export type { BookingConfirmScreenProps } from "./types";

export function BookingConfirmScreen(props: BookingConfirmScreenProps) {
  const { theme } = useAppTheme();
  const styles = getBookingConfirmStyles(theme);
  const {
    bookingBusy,
    customerEmail,
    dialog,
    dialogContent,
    error,
    est,
    isError,
    isPending,
    onConfirm,
    onDialogRequestClose,
    professional,
    service,
    setCustomerEmail,
    summaryRows,
  } = useBookingConfirmScreen(props);

  if (isPending) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <ActivityIndicator color={theme.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !est || !service || !professional) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text style={styles.errorText} variant="bodyTight">
          {error?.message ?? "Dados incompletos para reservar."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {dialogContent ? (
        <AlertDialog
          buttons={dialogContent.buttons}
          message={dialogContent.message}
          title={dialogContent.title}
          visible={dialog.kind !== "none"}
          onRequestClose={onDialogRequestClose}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <Text style={styles.title} variant="title">
          Resumo do atendimento
        </Text>
        <Text style={styles.intro} variant="hint">
          Regista o atendimento na agenda do local. O cliente precisa de conta
          na app com o e-mail abaixo.
        </Text>

        <View style={styles.customerEmailSection}>
          <Text variant="fieldLabel">E-mail do cliente (conta na app)</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="nome@exemplo.com"
            placeholderTextColor={theme.textMuted}
            style={styles.customerEmailInput}
            value={customerEmail}
            onChangeText={setCustomerEmail}
          />
        </View>

        <DetailFactsCard compactTop rows={summaryRows} />
      </ScrollView>
      <View style={styles.footerBar}>
        <Pressable
          accessibilityRole="button"
          disabled={bookingBusy}
          style={({ pressed }) => [
            styles.cta,
            styles.ctaInFooter,
            pressed && styles.ctaPressed,
            bookingBusy && styles.ctaBusy,
          ]}
          onPress={onConfirm}
        >
          <Text style={styles.ctaText} variant="ctaPrimary">
            Registar atendimento
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
