import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AlertDialog } from "../../components/AlertDialog/AlertDialog";
import { renderAgendoCalendarDay } from "../../components/AgendoCalendarDay";
import { MonthCalendar } from "../../components/MonthCalendar/MonthCalendar";
import { Text } from "../../components/Text";
import { SERVICE_IONICON } from "../../constants/serviceIonicon";
import { useStaffAgendaCalendarScreen } from "./hooks/useStaffAgendaCalendarScreen";
import {
  formatBookingRange,
  formatBookingStatusLabel,
} from "./utils/bookingFormat";
import type { StaffAgendaCalendarScreenProps } from "./types";

export type { StaffAgendaCalendarScreenProps } from "./types";

export function StaffAgendaCalendarScreen(
  props: StaffAgendaCalendarScreenProps,
) {
  const {
    bookingsForSelected,
    cancelDialogBookingId,
    cancelError,
    cancelMutation,
    confirmStaffCancel,
    isPending,
    local,
    onStaffCalendarMonthChange,
    selectedKey,
    setCancelDialogBookingId,
    setCancelError,
    setSelectedKey,
    staffCalendarDayCtx,
    staffMarkedDates,
    styles,
    summaryStyles,
    theme,
    viewMonth,
    viewYear,
  } = useStaffAgendaCalendarScreen(props);

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <AlertDialog
        buttons={[
          {
            label: "Voltar",
            onPress: () => setCancelDialogBookingId(null),
            variant: "secondary",
          },
          {
            label: cancelMutation.isPending ? "A cancelar…" : "Cancelar",
            onPress: confirmStaffCancel,
            variant: "destructive",
          },
        ]}
        message="O cliente deixa de ver este horário na app. Confirma o cancelamento?"
        title="Cancelar atendimento"
        visible={cancelDialogBookingId !== null}
        onRequestClose={() => setCancelDialogBookingId(null)}
      />
      {cancelError ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: () => setCancelError(null),
              variant: "primary",
            },
          ]}
          message={cancelError.message}
          title={cancelError.title}
          visible
          onRequestClose={() => setCancelError(null)}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <Text style={local.intro} variant="hint">
          Os dias destacados no calendário têm pelo menos um atendimento com
          cliente agendado.
        </Text>

        <MonthCalendar
          footerBelowGrid={
            <View style={local.legendRow}>
              <View style={local.legendDot} />
              <Text style={local.legendLabel} variant="caption">
                Dia com cliente marcado
              </Text>
            </View>
          }
          loading={isPending}
          loadingHint="Carregando o mês…"
          markedDates={staffMarkedDates}
          monthIndex={viewMonth}
          renderDay={(args) =>
            renderAgendoCalendarDay(args, staffCalendarDayCtx)
          }
          weekStartsOn="monday"
          weekVerticalMargin={4}
          year={viewYear}
          onDayPress={(d) => setSelectedKey(d.dateString)}
          onMonthChange={onStaffCalendarMonthChange}
        />

        <View style={local.detailSection}>
          <Text style={local.sectionTitle} variant="fieldLabel">
            {selectedKey
              ? `Horários — ${selectedKey.split("-").reverse().join("/")}`
              : "Detalhe do dia"}
          </Text>
          {!selectedKey ? (
            <Text variant="body">
              Toque num dia no calendário para listar os horários com cliente.
            </Text>
          ) : bookingsForSelected.length === 0 ? (
            <Text variant="body">
              Nenhum atendimento com cliente neste dia.
            </Text>
          ) : (
            bookingsForSelected.map((booking, index) => (
              <View
                key={booking.id}
                style={[
                  summaryStyles.summaryCard,
                  local.staffSummaryCard,
                  index > 0 && local.staffSummaryCardSpacing,
                ]}
              >
                <View
                  style={[
                    summaryStyles.summaryGridRow,
                    summaryStyles.summaryGridRowFirst,
                  ]}
                >
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name="time-outline"
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        Horário
                      </Text>
                    </View>
                    <Text
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {formatBookingRange(booking.startsAt, booking.endsAt)}
                    </Text>
                  </View>
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name={SERVICE_IONICON}
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        Serviço
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {booking.serviceName}
                    </Text>
                  </View>
                </View>
                <View style={summaryStyles.summaryGridRow}>
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name="person-outline"
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        Cliente
                      </Text>
                    </View>
                    <Text
                      numberOfLines={2}
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {booking.customerDisplayName}
                    </Text>
                  </View>
                  <View style={summaryStyles.summaryCell}>
                    <View style={summaryStyles.summaryCellHeader}>
                      <Ionicons
                        color={theme.accent}
                        name="flag-outline"
                        size={18}
                      />
                      <Text
                        style={summaryStyles.summaryCellLabel}
                        variant="caption"
                      >
                        Estado
                      </Text>
                    </View>
                    <Text
                      style={summaryStyles.summaryCellValue}
                      variant="bodyTight"
                    >
                      {formatBookingStatusLabel(booking.status)}
                    </Text>
                  </View>
                </View>
                <View style={local.summaryCancelFooter}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: cancelMutation.isPending }}
                    disabled={cancelMutation.isPending}
                    style={({ pressed }) => [
                      local.summaryCancelButton,
                      pressed && local.summaryCancelButtonPressed,
                    ]}
                    onPress={() => setCancelDialogBookingId(booking.id)}
                  >
                    <Text
                      style={local.summaryCancelButtonLabel}
                      variant="bodyTight"
                    >
                      Cancelar atendimento
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
