import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import { Platform, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { cancelPartnerAppointment } from "../../../api/public/partner";
import type { AgendoCalendarDayRenderContext } from "../../../components/AgendoCalendarDay";
import { Text } from "../../../components/Text";
import { getScreenFormStyles } from "../../../components/ScreenForm";
import { useAppTheme } from "../../../hooks/useAppTheme";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { AppointmentsStack } from "../../../navigation/routeIds";
import { useAuth } from "../../../providers/AuthProvider";
import { localDayKey } from "../../../utils/bookingCalendar";
import { monthBoundsIsoLocal } from "../../../utils/monthCalendarGrid";

import { getBookingScheduleStyles } from "../../BookingScheduleScreen/styles";
import { useStaffAgendaCalendarBookingsData } from "../fetch/useStaffAgendaCalendarBookingsData";
import { getStaffAgendaCalendarScreenStyles } from "../styles";
import type { StaffAgendaCalendarScreenProps } from "../types";

export function useStaffAgendaCalendarScreen({
  navigation,
  route,
}: StaffAgendaCalendarScreenProps) {
  const { establishmentId, establishmentName } = route.params;
  const { t } = useTranslation("staff");
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { theme } = useAppTheme();
  const styles = useMemo(() => getScreenFormStyles(theme), [theme]);
  const local = useMemo(
    () => getStaffAgendaCalendarScreenStyles(theme),
    [theme],
  );
  const summaryStyles = useMemo(() => getBookingScheduleStyles(theme), [theme]);

  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [selectedKey, setSelectedKey] = useState<string | null>(() =>
    localDayKey(new Date()),
  );
  const [cancelDialogBookingId, setCancelDialogBookingId] = useState<
    string | null
  >(null);
  const [cancelError, setCancelError] = useState<{
    message: string;
    title: string;
  } | null>(null);

  const viewYear = monthAnchor.getFullYear();
  const viewMonth = monthAnchor.getMonth();

  const headerRight = useCallback(() => {
    return (
      <Pressable
        accessibilityLabel={t("calendar.newBooking")}
        accessibilityRole="button"
        hitSlop={8}
        style={({ pressed }) => [
          local.headerAddButton,
          pressed && local.headerAddButtonPressed,
        ]}
        onPress={() => {
          const uid = session?.userId;
          if (!uid) {
            return;
          }
          const nav = navigation as NavigationProp<ParamListBase>;
          nav.navigate(AppointmentsStack.StaffNewBookingType, {
            bookingFlowOrigin: "appointments",
            defaultPerformerUserId: uid,
            establishmentId,
            establishmentName,
            returnToStaffAgenda: { establishmentId, establishmentName },
          });
        }}
      >
        <Ionicons color={theme.accent} name="add" size={22} />
        <Text style={local.headerAddLabel} variant="bodyTight">
          {t("calendar.newBookingLabel")}
        </Text>
      </Pressable>
    );
  }, [
    establishmentId,
    establishmentName,
    local.headerAddButton,
    local.headerAddButtonPressed,
    local.headerAddLabel,
    navigation,
    session?.userId,
    t,
    theme.accent,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: establishmentName,
      ...(Platform.OS === "ios"
        ? {
            unstable_headerRightItems: () => [
              {
                type: "custom" as const,
                element: headerRight(),
                hidesSharedBackground: true,
              },
            ],
          }
        : {
            headerRight,
          }),
    });
  }, [establishmentName, headerRight, navigation]);

  useEffect(() => {
    const now = new Date();
    if (now.getFullYear() === viewYear && now.getMonth() === viewMonth) {
      setSelectedKey(localDayKey(now));
    } else {
      setSelectedKey(null);
    }
  }, [viewMonth, viewYear]);

  const { from, to } = useMemo(
    () => monthBoundsIsoLocal(viewYear, viewMonth),
    [viewMonth, viewYear],
  );

  const bookingsQuery = useStaffAgendaCalendarBookingsData(
    establishmentId,
    from,
    to,
  );

  const { data: bookingsRes, isPending } = bookingsQuery;

  const bookings = useMemo(() => bookingsRes?.data ?? [], [bookingsRes?.data]);

  const visibleBookings = useMemo(
    () => bookings.filter((booking) => booking.status !== "CANCELLED"),
    [bookings],
  );

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      cancelPartnerAppointment(establishmentId, appointmentId),
    onError: (error) => {
      setCancelDialogBookingId(null);
      const msg =
        error instanceof Error
          ? error.message
          : t("calendar.cancelErrorDefault");
      setCancelError({ title: t("calendar.cancelErrorTitle"), message: msg });
    },
    onSuccess: async () => {
      setCancelDialogBookingId(null);
      await queryClient.invalidateQueries({
        queryKey: ["partner", "staff-bookings", establishmentId],
      });
    },
  });

  const bookingDates = useMemo(() => {
    const datesWithBookings = new Set<string>();
    for (const booking of visibleBookings) {
      datesWithBookings.add(localDayKey(new Date(booking.startsAt)));
    }
    return datesWithBookings;
  }, [visibleBookings]);

  const todayKey = useMemo(() => localDayKey(new Date()), []);

  const bookingsForSelected = useMemo(() => {
    if (!selectedKey) {
      return [];
    }
    return visibleBookings.filter(
      (booking) => localDayKey(new Date(booking.startsAt)) === selectedKey,
    );
  }, [visibleBookings, selectedKey]);

  const staffMarkedDates = useMemo((): MarkedDates => {
    if (!selectedKey) {
      return {};
    }
    return { [selectedKey]: { selected: true } };
  }, [selectedKey]);

  const staffCalendarDayCtx = useMemo(
    (): AgendoCalendarDayRenderContext => ({
      variant: "staff",
      bookingDates,
      selectedKey,
      todayKey,
    }),
    [bookingDates, selectedKey, todayKey],
  );

  const onStaffCalendarMonthChange = useCallback((d: DateData) => {
    setMonthAnchor(new Date(d.year, d.month - 1, 1));
  }, []);

  const confirmStaffCancel = useCallback(() => {
    if (!cancelDialogBookingId || cancelMutation.isPending) {
      return;
    }
    cancelMutation.mutate(cancelDialogBookingId);
  }, [cancelDialogBookingId, cancelMutation]);

  return {
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
  };
}
