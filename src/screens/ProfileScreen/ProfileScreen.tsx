import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
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
  const { theme, override, setOverride } = useAppTheme();
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
    { label: "Sistema", value: null },
    { label: "Claro", value: "light" },
    { label: "Escuro", value: "dark" },
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
              label: "Cancelar",
              onPress: () => setDialog({ kind: "none" }),
              variant: "secondary" as const,
            },
            {
              label: "Sair",
              onPress: () => {
                setDialog({ kind: "none" });
                void signOut();
              },
              variant: "destructive" as const,
            },
          ],
          message: "Tem certeza que deseja sair da sua conta?",
          title: "Sair",
        };
      case "info":
        return {
          buttons: [
            {
              label: "OK",
              onPress: () => setDialog({ kind: "none" }),
              variant: "primary" as const,
            },
          ],
          message: dialog.message,
          title: dialog.title,
        };
    }
  }, [dialog, signOut]);

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
        <Text style={styles.title}>Perfil</Text>

        <Text style={styles.sectionLabel}>Conta</Text>
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
                  title: "Login",
                  message:
                    e instanceof Error
                      ? e.message
                      : "Não foi possível concluir o login.",
                });
              } finally {
                setLoginBusy(false);
              }
            }}
          >
            <Text style={styles.loginBtnText}>LOGIN</Text>
          </Pressable>
        ) : (
          <>
            <AgendoText style={styles.welcomeLine} variant="bodyTight">
              {`Bem-vindo, ${welcomeName || "Visitante"}`}
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
                <Text style={styles.loginBtnText}>Editar perfil</Text>
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
                <Text style={styles.loginBtnText}>Completar cadastro</Text>
              </Pressable>
            )}
          </>
        )}
        <Text style={styles.sectionLabel}>Suporte</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() => openMail("Suporte Agendô")}
        >
          <View style={styles.linkRow}>
            <View style={styles.linkTextColumn}>
              <Text style={styles.linkTitle}>Falar com suporte</Text>
              <Text style={styles.linkSubtitle}>{SUPPORT_EMAIL}</Text>
            </View>
            <Ionicons color={theme.textMuted} name="mail-outline" size={22} />
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() =>
            openMail(
              "Sugestão de nova categoria / serviço",
              "Descreva o serviço que não encontrou na lista da plataforma:\n\n",
            )
          }
        >
          <View style={styles.linkRow}>
            <View style={styles.linkTextColumn}>
              <Text style={styles.linkTitle}>Sugerir categoria</Text>
              <Text style={styles.linkSubtitle}>
                Envie uma sugestao para avaliarmos novas categorias.
              </Text>
            </View>
            <Ionicons
              color={theme.textMuted}
              name="chatbox-ellipses-outline"
              size={22}
            />
          </View>
        </Pressable>

        <Text style={styles.sectionLabel}>Legal</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() =>
            setDialog({
              kind: "info",
              title: "Termos de uso",
              message:
                "Os termos completos serao publicados antes do lancamento.",
            })
          }
        >
          <View style={styles.linkRow}>
            <Text style={styles.linkTitle}>Termos de uso</Text>
            <Ionicons
              color={theme.textMuted}
              name="chevron-forward"
              size={20}
            />
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={styles.linkCard}
          onPress={() =>
            setDialog({
              kind: "info",
              title: "Privacidade",
              message:
                "A politica de privacidade completa sera publicada antes do lancamento.",
            })
          }
        >
          <View style={styles.linkRow}>
            <Text style={styles.linkTitle}>Política de privacidade</Text>
            <Ionicons
              color={theme.textMuted}
              name="chevron-forward"
              size={20}
            />
          </View>
        </Pressable>
        <Text style={styles.subtle}>
          Este conteudo legal esta em preparacao e sera atualizado antes do
          lancamento.
        </Text>

        <Text style={styles.sectionLabel}>Aparência</Text>
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
            <Text style={styles.loginBtnText}>Sair</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
