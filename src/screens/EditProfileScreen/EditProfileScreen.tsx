import { Ionicons } from "@expo/vector-icons";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { useAuth } from "../../providers/AuthProvider";
import { palette } from "../../theme/colors";
import { formatCpfDisplay } from "../../utils/cpf";
import {
  formatBrazilPhoneDisplay,
  normalizePhoneDigits,
} from "../../utils/phone";
import { isProfileComplete } from "../../utils/validateUserProfile";
import { EDIT_PROFILE_ICON_SIZE, getEditProfileStyles } from "./styles";

export function EditProfileScreen({
  navigation,
}: ProfileScreenProps<"EditProfile">) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => getEditProfileStyles(theme), [theme]);
  const iconSize = EDIT_PROFILE_ICON_SIZE;
  const { completeRegistration, profile, session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  useLayoutEffect(() => {
    if (!session?.accessToken || !profile) {
      navigation.goBack();
      return;
    }
    setFullName(profile.fullName.trim());
    setPhoneDigits(normalizePhoneDigits(profile.phone, 11));
  }, [navigation, profile, session?.accessToken]);

  const draft = useMemo(
    () =>
      profile
        ? {
            cpf: profile.cpf,
            email: profile.email.trim(),
            fullName,
            phone: formatBrazilPhoneDisplay(phoneDigits),
          }
        : null,
    [fullName, phoneDigits, profile],
  );

  const canSave = useMemo(
    () => (draft ? isProfileComplete(draft) : false),
    [draft],
  );

  const onSave = useCallback(async () => {
    if (!profile || !draft) {
      return;
    }
    setBusy(true);
    try {
      await completeRegistration({
        cpf: profile.cpf,
        email: profile.email.trim(),
        fullName: draft.fullName.trim(),
        phone: draft.phone,
      });
      navigation.goBack();
    } catch (e) {
      setSaveError({
        title: "Não foi possível salvar",
        message: e instanceof Error ? e.message : "Tente novamente.",
      });
    } finally {
      setBusy(false);
    }
  }, [completeRegistration, draft, navigation, profile]);

  if (!session?.accessToken || !profile) {
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
        <View style={styles.card}>
          <View style={[styles.fieldRow, styles.fieldRowBorder]}>
            <View style={styles.iconWrap}>
              <Ionicons
                color={theme.accent}
                name="person-outline"
                size={iconSize}
              />
            </View>
            <View style={styles.fieldCol}>
              <Text style={styles.rowLabel} variant="caption">
                Nome completo
              </Text>
              <View style={[styles.inputShell, styles.inputShellEditable]}>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder="Seu nome"
                  placeholderTextColor={theme.textMuted}
                  style={styles.inputInner}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>
          </View>

          <View style={[styles.fieldRow, styles.fieldRowBorder]}>
            <View style={styles.iconWrap}>
              <Ionicons
                color={theme.accent}
                name="mail-outline"
                size={iconSize}
              />
            </View>
            <View style={styles.fieldCol}>
              <Text style={styles.rowLabel} variant="caption">
                E-mail
              </Text>
              <View style={[styles.inputShell, styles.inputShellLocked]}>
                <TextInput
                  editable={false}
                  selectTextOnFocus={false}
                  style={[styles.inputInner, styles.inputInnerLocked]}
                  value={profile.email}
                />
              </View>
            </View>
          </View>

          <View style={[styles.fieldRow, styles.fieldRowBorder]}>
            <View style={styles.iconWrap}>
              <Ionicons
                color={theme.accent}
                name="call-outline"
                size={iconSize}
              />
            </View>
            <View style={styles.fieldCol}>
              <Text style={styles.rowLabel} variant="caption">
                Telefone
              </Text>
              <View style={[styles.inputShell, styles.inputShellEditable]}>
                <TextInput
                  keyboardType="phone-pad"
                  maxLength={15}
                  placeholder="(11) 98765-4321"
                  placeholderTextColor={theme.textMuted}
                  style={styles.inputInner}
                  value={formatBrazilPhoneDisplay(phoneDigits)}
                  onChangeText={(t) =>
                    setPhoneDigits(normalizePhoneDigits(t, 11))
                  }
                />
              </View>
            </View>
          </View>

          <View style={[styles.fieldRow, styles.fieldRowLast]}>
            <View style={styles.iconWrap}>
              <Ionicons
                color={theme.accent}
                name="id-card-outline"
                size={iconSize}
              />
            </View>
            <View style={styles.fieldCol}>
              <Text style={styles.rowLabel} variant="caption">
                CPF
              </Text>
              <View style={[styles.inputShell, styles.inputShellLocked]}>
                <TextInput
                  editable={false}
                  selectTextOnFocus={false}
                  style={[styles.inputInner, styles.inputInnerLocked]}
                  value={profile.cpf ? formatCpfDisplay(profile.cpf) : "—"}
                />
              </View>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={busy || !canSave}
          style={({ pressed }) => [
            styles.cta,
            pressed && !(busy || !canSave) && { opacity: 0.92 },
            (busy || !canSave) && styles.ctaDisabled,
          ]}
          onPress={() => void onSave()}
        >
          {busy ? (
            <ActivityIndicator color={palette.onAccent} />
          ) : (
            <Text variant="ctaPrimary">Salvar alterações</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
