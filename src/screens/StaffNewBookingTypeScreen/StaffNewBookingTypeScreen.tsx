import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppointmentsScreenProps } from "../../navigation/appointmentsNavigation.types";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import { AppointmentsStack, ProfileStack } from "../../navigation/routeIds";

import { getStaffNewBookingTypeStyles } from "./styles";

export type StaffNewBookingTypeScreenProps =
  | AppointmentsScreenProps<"StaffNewBookingType">
  | ProfileScreenProps<"StaffNewBookingType">;

export function StaffNewBookingTypeScreen({
  navigation,
  route,
}: StaffNewBookingTypeScreenProps) {
  const {
    bookingFlowOrigin,
    defaultPerformerUserId,
    establishmentId,
    returnToStaffAgenda,
  } = route.params;
  const { theme } = useAppTheme();
  const styles = useMemo(() => getStaffNewBookingTypeStyles(theme), [theme]);
  const nav = navigation as NavigationProp<ParamListBase>;

  const onPersonalCommitment = () => {
    if (bookingFlowOrigin === "profile") {
      nav.navigate(ProfileStack.StaffPersonalCommitment, {
        bookingFlowOrigin: "profile",
        establishmentId,
        returnToStaffAgenda,
      });
    } else {
      nav.navigate(AppointmentsStack.StaffPersonalCommitment, {
        bookingFlowOrigin: "appointments",
        establishmentId,
        returnToStaffAgenda,
      });
    }
  };

  const onClientBooking = () => {
    if (bookingFlowOrigin === "profile") {
      nav.navigate(ProfileStack.StaffBookingServiceSelect, {
        bookingFlowOrigin: "profile",
        defaultPerformerUserId,
        establishmentId,
        returnToStaffAgenda,
        staffAssistedBooking: true,
      });
    } else {
      nav.navigate(AppointmentsStack.StaffBookingServiceSelect, {
        bookingFlowOrigin: "appointments",
        defaultPerformerUserId,
        establishmentId,
        returnToStaffAgenda,
        staffAssistedBooking: true,
      });
    }
  };

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={onPersonalCommitment}
        >
          <View style={styles.cardIconWrap}>
            <Ionicons
              color={theme.accent}
              name="lock-closed-outline"
              size={22}
            />
          </View>
          <View style={styles.cardTextBlock}>
            <Text variant="listTitle">Compromisso Pessoal</Text>
            <Text style={styles.cardDescription} variant="caption">
              Escolha essa opção para bloquear um período da sua agenda e
              cumprir um compromisso particular.
            </Text>
          </View>
          <Ionicons color={theme.textMuted} name="chevron-forward" size={20} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={onClientBooking}
        >
          <View style={styles.cardIconWrap}>
            <Ionicons color={theme.accent} name="person-outline" size={22} />
          </View>
          <View style={styles.cardTextBlock}>
            <Text variant="listTitle">Cliente</Text>
            <Text style={styles.cardDescription} variant="caption">
              Escolha essa opção para agendar um horário de atendimento para um
              cliente.
            </Text>
          </View>
          <Ionicons color={theme.textMuted} name="chevron-forward" size={20} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
