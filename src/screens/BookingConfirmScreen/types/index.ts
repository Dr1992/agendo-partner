import type { AppointmentsScreenProps } from "../../../navigation/appointmentsNavigation.types";

export type BookingConfirmScreenProps =
  AppointmentsScreenProps<"StaffBookingConfirm">;

export type BookingDialogState =
  | { kind: "none" }
  | { kind: "booking_error"; message: string }
  | { kind: "confirm" }
  | { kind: "success" };
