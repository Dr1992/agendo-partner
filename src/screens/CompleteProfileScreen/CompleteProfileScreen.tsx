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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("onboarding");
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
        title: t("completeProfile.saveErrorTitle"),
        message:
          e instanceof Error ? e.message : t("completeProfile.saveErrorFallback"),
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
    t,
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
              label: t("completeProfile.okButton"),
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
        <Text style={styles.title}>{t("completeProfile.title")}</Text>
        <Text style={styles.body}>{t("completeProfile.body")}</Text>
        <Text style={styles.fieldLabel}>
          {t("completeProfile.fullNameLabel")}
        </Text>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          placeholder={t("completeProfile.fullNamePlaceholder")}
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.fieldLabel}>{t("completeProfile.emailLabel")}</Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder={t("completeProfile.emailPlaceholder")}
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.fieldLabel}>{t("completeProfile.phoneLabel")}</Text>
        <TextInput
          keyboardType="phone-pad"
          maxLength={15}
          placeholder={t("completeProfile.phonePlaceholder")}
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={formatBrazilPhoneDisplay(phoneDigits)}
          onChangeText={(input) =>
            setPhoneDigits(normalizePhoneDigits(input, 11))
          }
        />
        <Text style={styles.fieldLabel}>{t("completeProfile.cpfLabel")}</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={14}
          placeholder={t("completeProfile.cpfPlaceholder")}
          placeholderTextColor={theme.textMuted}
          style={styles.field}
          value={formatCpfDisplay(cpfDigits)}
          onChangeText={(input) =>
            setCpfDigits(normalizeCpfDigits(input).slice(0, 11))
          }
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
            <Text style={styles.ctaText}>{t("completeProfile.saveButton")}</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
