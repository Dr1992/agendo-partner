import type { AppointmentStatus } from "../types/appointment";

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  cancelled: "Cancelado",
  completed: "Realizado",
  confirmed: "Confirmado",
  no_show: "Não compareceu",
  pending_confirmation: "Pendente de confirmação",
};

export const appointmentStatusDescription: Record<AppointmentStatus, string> = {
  cancelled: "Este agendamento foi cancelado.",
  completed: "Atendimento concluído. Avaliações seguem as regras do Agendô.",
  confirmed: "Seu horário está confirmado no estabelecimento.",
  no_show: "Registrado como falta do cliente.",
  pending_confirmation:
    "O estabelecimento precisa aceitar antes de ficar confirmado.",
};
