import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { useAppTheme } from "../../hooks/useAppTheme";
import { palette } from "../../theme/colors";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { useAuth } from "../../providers/AuthProvider";
import type { UserProfile } from "../../types/auth";
import { formatCpfDisplay, normalizeCpfDigits } from "../../utils/cpf";
import {
  formatBrazilPhoneDisplay,
  normalizePhoneDigits,
} from "../../utils/phone";
import { isProfileComplete } from "../../utils/validateUserProfile";
import { getScreenFormStyles } from "../../components/ScreenForm";

export function CompleteProfileScreen({
  navigation,
}: ProfileScreenProps<"CompleteProfile">) {
  const { theme } = useAppTheme();
  const styles = getScreenFormStyles(theme);
  const { cancelPendingSignIn, completeRegistration, session } = useAuth();
  const completingRef = useRef(false);

  const [fullName, setFullName] = useState(() =>
    (session?.displayNameFromProvider ?? "").trim(),
  );
  const [email, setEmail] = useState(() => session?.email ?? "");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [cpfDigits, setCpfDigits] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const profileDraft = useMemo(
    (): UserProfile => ({
      cpf: cpfDigits,
      email: email.trim(),
      fullName,
      phone: formatBrazilPhoneDisplay(phoneDigits),
    }),
    [cpfDigits, email, fullName, phoneDigits],
  );

  const canSave = useMemo(
    () => isProfileComplete(profileDraft),
    [profileDraft],
  );

  useLayoutEffect(() => {
    if (!session?.accessToken) {
      navigation.goBack();
    }
  }, [navigation, session?.accessToken]);

  useEffect(() => {
    return navigation.addListener("beforeRemove", () => {
      if (completingRef.current) {
        completingRef.current = false;
        return;
      }
      void cancelPendingSignIn();
    });
  }, [cancelPendingSignIn, navigation]);

  const onSave = useCallback(async () => {
    setBusy(true);
    try {
      await completeRegistration({
        cpf: cpfDigits,
        email,
        fullName,
        phone: formatBrazilPhoneDisplay(phoneDigits),
      });
      completingRef.current = true;
      navigation.goBack();
    } catch (e) {
      setSaveError({
        title: "Não foi possível salvar",
        message: e instanceof Error ? e.message : "Tente novamente.",
      });
    } finally {
      setBusy(false);
    }
  }, [
    completeRegistration,
    cpfDigits,
    email,
    fullName,
    navigation,
    phoneDigits,
  ]);

  if (!session?.accessToken) {
    return null;
  }

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      {saveError ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: () => setSaveError(null),
              variant: "primary",
            },
          ]}
          message={saveError.message}
          title={saveError.title}
          visible
          onRequestClose={() => setSaveError(null)}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <Text style={styles.title}>Complete seu cadastro</Text>
        <Text style={styles.body}>
          Falta finalizar seus dados para liberar todos os recursos do app.
          Preencha os campos abaixo para continuar.
        </Text>
        <Text style={styles.fieldLabel}>Nome completo</Text>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          placeholder="Seu nome"
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.fieldLabel}>E-mail</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="voce@email.com"
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.fieldLabel}>Telefone (celular)</Text>
        <TextInput
          keyboardType="phone-pad"
          maxLength={15}
          placeholder="(11) 98765-4321"
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={formatBrazilPhoneDisplay(phoneDigits)}
          onChangeText={(t) => setPhoneDigits(normalizePhoneDigits(t, 11))}
        />
        <Text style={styles.fieldLabel}>CPF (apenas números)</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={14}
          placeholder="000.000.000-00"
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={formatCpfDisplay(cpfDigits)}
          onChangeText={(t) => setCpfDigits(normalizeCpfDigits(t).slice(0, 11))}
        />
        <Pressable
          accessibilityRole="button"
          disabled={busy || !canSave}
          style={({ pressed }) => [
            styles.cta,
            pressed && { opacity: 0.92 },
            (busy || !canSave) && { opacity: 0.6 },
          ]}
          onPress={() => void onSave()}
        >
          {busy ? (
            <ActivityIndicator color={palette.onAccent} />
          ) : (
            <Text style={styles.ctaText}>Salvar e continuar</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
