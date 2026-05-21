import type { AppointmentsScreenProps } from "../../../navigation/appointmentsNavigation.types";
import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";

export type StaffAgendaCalendarScreenProps =
  | ProfileScreenProps<"StaffAgendaCalendar">
  | AppointmentsScreenProps<"StaffAgendaCalendar">;
