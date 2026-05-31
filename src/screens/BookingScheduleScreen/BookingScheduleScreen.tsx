import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  renderAgendoCalendarDay,
  type AgendoCalendarDayRenderContext,
} from "../../components/AgendoCalendarDay";
import { MonthCalendar } from "../../components/MonthCalendar/MonthCalendar";
import { Text as AppText } from "../../components/Text";
import {
  useBookingScheduleEstablishmentData,
  useBookingScheduleSlotsData,
} from "./fetch/useBookingScheduleData";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppointmentsScreenProps } from "../../navigation/appointmentsNavigation.types";
import { navigateFromScheduleToConfirm } from "../../navigation/staffBookingNavigate";
import type { TimeSlotOption } from "../../types/timeSlot";
import {
  isEstablishmentOpenOnLocalDay,
  localDayKey,
  parseIsoToLocalDate,
  sameLocalDay,
  startOfLocalDay,
} from "../../utils/bookingCalendar";
import {
  endTimeLabel,
  formatPriceAmount,
  slotTimeLabel,
  sortProfessionalsForBookingStrip,
} from "./bookingScheduleHelpers";
import {
  BookingScheduleProfessionalStrip,
  BookingScheduleSummaryCard,
  BookingScheduleTimeSlotsSection,
} from "./components";
import { getBookingScheduleStyles } from "./styles";

export type BookingScheduleScreenProps =
  AppointmentsScreenProps<"StaffBookingSchedule">;

export function BookingScheduleScreen({
  navigation,
  route,
}: BookingScheduleScreenProps) {
  const {
    bookingFlowOrigin,
    defaultPerformerUserId,
    establishmentId,
    returnToStaffAgenda,
    serviceId,
  } = route.params;
  const { t } = useTranslation("booking");
  const { theme } = useAppTheme();
  const styles = useMemo(() => getBookingScheduleStyles(theme), [theme]);
  const scrollRef = useRef<ScrollView>(null);

  const now = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => ({
    month: now.getMonth(),
    year: now.getFullYear(),
  }));
  const [selectedDate, setSelectedDate] = useState(() => startOfLocalDay(now));
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotOption | null>(null);

  const { data: est, isPending: estPending } =
    useBookingScheduleEstablishmentData(establishmentId);

  const service = useMemo(
    () => est?.services.find((serviceItem) => serviceItem.id === serviceId),
    [est?.services, serviceId],
  );

  const professionals = useMemo(() => {
    if (!est || !service) {
      return [];
    }
    const ids = service.professionalIds;
    let raw;
    if (ids.includes("any") || ids.length === 0) {
      raw = [...est.professionals];
    } else {
      const allowed = new Set(ids);
      raw = est.professionals.filter((participant) =>
        allowed.has(participant.id),
      );
    }
    return sortProfessionalsForBookingStrip(raw);
  }, [est, service]);

  const staffPickList = useMemo(
    () => professionals.filter((participant) => participant.id !== "any"),
    [professionals],
  );

  useEffect(() => {
    if (!defaultPerformerUserId || !est || !service) {
      return;
    }
    const inList = staffPickList.some(
      (participant) => participant.id === defaultPerformerUserId,
    );
    if (inList) {
      setSelectedStaffId(defaultPerformerUserId);
    }
  }, [defaultPerformerUserId, est, service, staffPickList]);

  const professionalIdResolved = useMemo(() => {
    if (staffPickList.length === 0) {
      return "any";
    }
    if (
      selectedStaffId &&
      staffPickList.some((participant) => participant.id === selectedStaffId)
    ) {
      return selectedStaffId;
    }
    return staffPickList[0]!.id;
  }, [staffPickList, selectedStaffId]);

  const slotArgs = useMemo(
    () => ({
      durationMinutes: service?.durationMinutes ?? 0,
      establishmentId,
      professionalId: professionalIdResolved,
      serviceId,
    }),
    [
      establishmentId,
      professionalIdResolved,
      service?.durationMinutes,
      serviceId,
    ],
  );

  const {
    data: slots,
    error: slotsErr,
    isError: slotsError,
    isPending: slotsPending,
  } = useBookingScheduleSlotsData(slotArgs);

  useEffect(() => {
    setSelectedSlot(null);
  }, [professionalIdResolved]);

  useEffect(() => {
    if (!selectedSlot) {
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    });
  }, [selectedSlot]);

  const todayStart = useMemo(() => startOfLocalDay(now), [now]);

  const minDateKey = useMemo(() => localDayKey(todayStart), [todayStart]);

  const selectedDayStart = useMemo(
    () => startOfLocalDay(selectedDate),
    [selectedDate],
  );

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDayStart]);

  const slotsForSelectedDay = useMemo(() => {
    if (!slots) {
      return [];
    }
    const nowMs = now.getTime();
    return [...slots]
      .filter((slot) => {
        const slotDay = parseIsoToLocalDate(slot.startsAt);
        if (!sameLocalDay(slotDay, selectedDayStart)) {
          return false;
        }
        return new Date(slot.startsAt).getTime() > nowMs;
      })
      .sort((slotA, slotB) => slotA.startsAt.localeCompare(slotB.startsAt));
  }, [now, selectedDayStart, slots]);

  const openOnSelectedDay = useMemo(
    () => isEstablishmentOpenOnLocalDay(selectedDayStart, est?.openingSchedule),
    [est?.openingSchedule, selectedDayStart],
  );

  const showTimeSlotsLoader = openOnSelectedDay && slotsPending && !slotsError;
  const showTimeSlotsError = openOnSelectedDay && slotsError;
  const showClosedDayHint = !openOnSelectedDay;
  const showNoSlotsHint =
    openOnSelectedDay &&
    !slotsPending &&
    !slotsError &&
    slotsForSelectedDay.length === 0;

  const selectedProfessionalLabel = useMemo(() => {
    if (professionalIdResolved === "any") {
      return t("schedule.establishmentTeam");
    }
    return (
      professionals.find(
        (participant) => participant.id === professionalIdResolved,
      )?.name ?? "—"
    );
  }, [professionalIdResolved, professionals, t]);

  const bookingMarkedDates = useMemo((): MarkedDates => {
    const selectedDayKey = localDayKey(selectedDayStart);
    return { [selectedDayKey]: { selected: true } };
  }, [selectedDayStart]);

  const onPickDay = useCallback(
    (pickedDate: Date) => {
      const dayStart = startOfLocalDay(pickedDate);
      if (dayStart.getTime() < todayStart.getTime()) {
        return;
      }
      if (!isEstablishmentOpenOnLocalDay(dayStart, est?.openingSchedule)) {
        return;
      }
      setSelectedDate(dayStart);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        });
      });
    },
    [est?.openingSchedule, todayStart],
  );

  const onReserve = useCallback(() => {
    if (!selectedSlot) {
      return;
    }
    navigateFromScheduleToConfirm(navigation as NavigationProp<ParamListBase>, {
      bookingFlowOrigin,
      establishmentId,
      professionalId: professionalIdResolved,
      returnToStaffAgenda,
      serviceId,
      slotIso: selectedSlot.startsAt,
      staffAssistedBooking: true,
    });
  }, [
    bookingFlowOrigin,
    establishmentId,
    navigation,
    professionalIdResolved,
    returnToStaffAgenda,
    selectedSlot,
    serviceId,
  ]);

  const bookingCalendarDayCtx = useMemo(
    (): AgendoCalendarDayRenderContext => ({
      variant: "booking",
      establishmentOpenOnLocalDay: (day) =>
        isEstablishmentOpenOnLocalDay(day, est?.openingSchedule),
      now,
      selectedDate: selectedDayStart,
      todayStart,
    }),
    [est?.openingSchedule, now, selectedDayStart, todayStart],
  );

  const onCalendarDayPress = useCallback(
    (dayData: DateData) => {
      onPickDay(new Date(dayData.year, dayData.month - 1, dayData.day));
    },
    [onPickDay],
  );

  const onCalendarMonthChange = useCallback((dayData: DateData) => {
    setVisibleMonth({ year: dayData.year, month: dayData.month - 1 });
  }, []);

  if (estPending || !est) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <ActivityIndicator color={theme.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView edges={[]} style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{t("schedule.serviceNotFound")}</Text>
      </SafeAreaView>
    );
  }

  const durationMin = service.durationMinutes;
  const priceAmountLabel = formatPriceAmount(service.priceFrom);
  const slotRangeLabel =
    selectedSlot != null
      ? `${slotTimeLabel(selectedSlot.startsAt)} — ${endTimeLabel(selectedSlot.startsAt, durationMin)}`
      : "";

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <View style={styles.flexMain}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.bodyScrollContent}
          keyboardShouldPersistTaps="handled"
          style={styles.bodyScroll}
        >
          <BookingScheduleProfessionalStrip
            professionalIdResolved={professionalIdResolved}
            screenStyles={styles}
            staffList={staffPickList}
            onSelectStaff={setSelectedStaffId}
          />

          <View style={styles.calendarSection}>
            <View style={styles.calendarMonthBlock}>
              <MonthCalendar
                markedDates={bookingMarkedDates}
                minDate={minDateKey}
                monthIndex={visibleMonth.month}
                renderDay={(calendarArgs) =>
                  renderAgendoCalendarDay(calendarArgs, bookingCalendarDayCtx)
                }
                weekStartsOn="sunday"
                year={visibleMonth.year}
                onDayPress={onCalendarDayPress}
                onMonthChange={onCalendarMonthChange}
              />
            </View>
          </View>

          <BookingScheduleTimeSlotsSection
            screenStyles={styles}
            selectedSlot={selectedSlot}
            showClosedDayHint={showClosedDayHint}
            showNoSlotsHint={showNoSlotsHint}
            showTimeSlotsError={showTimeSlotsError}
            showTimeSlotsLoader={showTimeSlotsLoader}
            slotsErrorMessage={slotsErr?.message}
            slotsForSelectedDay={slotsForSelectedDay}
            theme={theme}
            onSelectSlot={setSelectedSlot}
          />

          {selectedSlot ? (
            <BookingScheduleSummaryCard
              priceAmountLabel={priceAmountLabel}
              screenStyles={styles}
              selectedProfessionalLabel={selectedProfessionalLabel}
              serviceName={service.name}
              slotRangeLabel={slotRangeLabel}
              theme={theme}
            />
          ) : null}
        </ScrollView>

        <View style={styles.footerBar}>
          <Pressable
            accessibilityRole="button"
            disabled={!selectedSlot}
            style={({ pressed }) => [
              styles.footerCta,
              !selectedSlot && styles.footerCtaDisabled,
              pressed && selectedSlot && styles.footerCtaPressed,
            ]}
            onPress={onReserve}
          >
            <Text style={styles.footerCtaText}>{t("schedule.continueCta")}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
