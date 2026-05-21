import type { AppointmentsScreenProps } from "../../../navigation/appointmentsNavigation.types";
import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";

export type StaffAgendaDetailScreenProps =
  | ProfileScreenProps<"StaffAgendaDetail">
  | AppointmentsScreenProps<"StaffAgendaDetail">;
