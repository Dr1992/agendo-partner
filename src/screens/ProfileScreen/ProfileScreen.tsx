import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ColorSchemeOverride } from "../../atoms/colorSchemeOverrideAtom";
import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { Text as AgendoText } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { LocaleOverride } from "../../i18n/localeAtom";
import { useLocale } from "../../i18n/useLocale";
import type { ProfileStackParamList } from "../../navigation/profileNavigation.types";
import { ProfileStack } from "../../navigation/routeIds";
import { useAuth } from "../../providers/AuthProvider";
import { getProfileStyles } from "./styles";

const SUPPORT_EMAIL = "suporte.agendo@gmail.com";

type ProfileMainNav = NativeStackNavigationProp<
  ProfileStackParamList,
  "ProfileMain"
>;

type ProfileDialogState =
  | { kind: "none" }
  | { kind: "sign_out_confirm" }
  | { kind: "info"; message: string; title: string };

export function ProfileScreen() {
  const navigation = useNavigation<ProfileMainNav>();
  const { t } = useTranslation();
  const { theme, override, setOverride } = useAppTheme();
  const { override: localeOverride, setOverride: setLocaleOverride } =
    useLocale();
  const styles = getProfileStyles(theme);
  const { profile, profileComplete, session, signIn, signOut } = useAuth();
  const [dialog, setDialog] = useState<ProfileDialogState>({ kind: "none" });
  const [loginBusy, setLoginBusy] = useState(false);

  const onPressSignOut = useCallback(() => {
    setDialog({ kind: "sign_out_confirm" });
  }, []);

  const welcomeName = useMemo(() => {
    if (!session) {
      return "";
    }
    const fromProfile = profile?.fullName?.trim();
    if (fromProfile) {
      return fromProfile;
    }
    const fromProvider = session.displayNameFromProvider?.trim();
    if (fromProvider) {
      return fromProvider;
    }
    const email = session.email?.trim();
    if (email?.includes("@")) {
      return email.split("@")[0] ?? "";
    }
    return "";
  }, [profile?.fullName, session]);

  const options: { label: string; value: ColorSchemeOverride }[] = [
    { label: t("profile.themeSystem"), value: null },
    { label: t("profile.themeLight"), value: "light" },
    { label: t("profile.themeDark"), value: "dark" },
  ];

  const languageOptions: { label: string; value: LocaleOverride }[] = [
    { label: t("language.system"), value: null },
    { label: t("language.pt"), value: "pt" },
    { label: t("language.en"), value: "en" },
  ];

  const openMail = (subject: string, body?: string) => {
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
    void Linking.openURL(mailtoUrl);
  };

  const alertDialogProps = useMemo(() => {
    switch (dialog.kind) {
      case "none":
        return null;
      case "sign_out_confirm":
        return {
          buttons: [
            {
              label: t("common.cancel"),
              onPress: () => setDialog({ kind: "none" }),
              variant: "secondary" as const,
            },
            {
              label: t("profile.signOut"),
              onPress: () => {
                setDialog({ kind: "none" });
                void signOut();
              },
              variant: "destructive" as const,
            },
          ],
          message: t("profile.signOutConfirmMessage"),
          title: t("profile.signOut"),
        };
      case "info":
        return {
          buttons: [
            {
              label: t("common.ok"),
              onPress: () => setDialog({ kind: "none" }),
              variant: "primary" as const,
            },
          ],
          message: dialog.message,
          title: dialog.title,
        };
    }
  }, [dialog, signOut, t]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Modal animationType="fade" transparent visible={loginBusy}>
        <View style={styles.loginBlockingOverlay} pointerEvents="auto">
          <ActivityIndicator color={theme.accent} size="large" />
        </View>
      </Modal>
      {alertDialogProps ? (
        <AlertDialog
          buttons={alertDialogProps.buttons}
          message={alertDialogProps.message}
          title={alertDialogProps.title}
          visible
          onRequestClose={() => setDialog({ kind: "none" })}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollFlex}
      >
        <Text style={styles.title}>{t("profile.title")}</Text>

        <Text style={styles.sectionLabel}>{t("profile.accountSection")}</Text>
        {!session ? (
          <Pressable
            accessibilityRole="button"
            disabled={loginBusy}
            style={({ pressed }) => [
              styles.loginBtn,
              loginBusy && styles.loginBtnBusy,
              pressed && !loginBusy && styles.pressedFeedback,
            ]}
            onPress={async () => {
              if (loginBusy) {
                return;
              }
              setLoginBusy(true);
              try {
                const signInResult = await signIn();
                if (!signInResult.profileComplete) {
                  navigation.navigate(ProfileStack.CompleteProfile);
                }
              } catch (e) {
                setDialog({
                  kind: "info",
                  title: t("profile.loginDialogTitle"),
                  message:
                    e instanceof Error
                      ? e.message
                      : t("profile.loginErrorDefault"),
                });
              } finally {
                setLoginBusy(false);
              }
            }}
          >
            <Text style={styles.loginBtnText}>{t("profile.login")}</Text>
          </Pressable>
        ) : (
          <>
            <AgendoText style={styles.welcomeLine} variant="bodyTight">
              {t("profile.welcome", {
                name: welcomeName || t("profile.guest"),
              })}
            </AgendoText>
            <Text style={styles.linkSubtitle}>{session.email}</Text>
            {profileComplete ? (
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.loginBtn,
                  styles.loginBtnStacked,
                  pressed && styles.pressedFeedback,
                ]}
                onPress={() => navigation.navigate(ProfileStack.EditProfile)}
              >
                <Text style={styles.loginBtnText}>
                  {t("profile.editProfile")}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.loginBtn,
                  styles.loginBtnStacked,
                  pressed && styles.pressedFeedback,
                ]}
                onPress={() =>
                  navigation.navigate(ProfileStack.CompleteProfile)
                }
              >
                <Text style={styles.loginBtnText}>
                  {t("profile.completeRegistration")}
                </Text>
              </Pressable>
            )}
          </>
        )}
        <Text style={styles.sectionLabel}>{t("profile.supportSection")}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() => openMail(t("profile.supportEmailSubject"))}
        >
          <View style={styles.linkRow}>
            <View style={styles.linkTextColumn}>
              <Text style={styles.linkTitle}>
                {t("profile.supportContact")}
              </Text>
              <Text style={styles.linkSubtitle}>{SUPPORT_EMAIL}</Text>
            </View>
            <Ionicons color={theme.textHint} name="mail-outline" size={22} />
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() =>
            openMail(
              t("profile.suggestionEmailSubject"),
              t("profile.suggestionEmailBody"),
            )
          }
        >
          <View style={styles.linkRow}>
            <View style={styles.linkTextColumn}>
              <Text style={styles.linkTitle}>
                {t("profile.suggestCategory")}
              </Text>
              <Text style={styles.linkSubtitle}>
                {t("profile.suggestCategoryDescription")}
              </Text>
            </View>
            <Ionicons
              color={theme.textHint}
              name="chatbox-ellipses-outline"
              size={22}
            />
          </View>
        </Pressable>

        <Text style={styles.sectionLabel}>{t("profile.legalSection")}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() =>
            setDialog({
              kind: "info",
              title: t("profile.termsDialogTitle"),
              message: t("profile.termsDialogMessage"),
            })
          }
        >
          <View style={styles.linkRow}>
            <Text style={styles.linkTitle}>{t("profile.termsOfUse")}</Text>
            <Ionicons color={theme.textHint} name="chevron-forward" size={20} />
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() =>
            setDialog({
              kind: "info",
              title: t("profile.privacyDialogTitle"),
              message: t("profile.privacyDialogMessage"),
            })
          }
        >
          <View style={styles.linkRow}>
            <Text style={styles.linkTitle}>{t("profile.privacyPolicy")}</Text>
            <Ionicons color={theme.textHint} name="chevron-forward" size={20} />
          </View>
        </Pressable>
        <Text style={styles.subtle}>{t("profile.legalNotice")}</Text>

        <Text style={styles.sectionLabel}>
          {t("profile.appearanceSection")}
        </Text>
        <View style={styles.row}>
          {options.map((opt) => {
            const active =
              opt.value === null ? override === null : override === opt.value;
            return (
              <Pressable
                key={opt.label}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setOverride(opt.value)}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>{t("language.section")}</Text>
        <View style={styles.row}>
          {languageOptions.map((opt) => {
            const active =
              opt.value === null
                ? localeOverride === null
                : localeOverride === opt.value;
            return (
              <Pressable
                key={opt.label}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setLocaleOverride(opt.value)}
              >
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {session ? (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.loginBtn,
              styles.signOutInScroll,
              pressed && styles.pressedFeedback,
            ]}
            onPress={onPressSignOut}
          >
            <Text style={styles.loginBtnText}>{t("profile.signOut")}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
