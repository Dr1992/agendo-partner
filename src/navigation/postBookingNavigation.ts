import { CommonActions } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";

import { AppointmentsStack } from "./routeIds";

export type StaffAgendaNavParams = {
  establishmentId: string;
  establishmentName: string;
};

/**
 * Após registo assistido: reseta o stack Agenda para mostrar o calendário.
 */
export function resetAgendaStackToStaffAgenda(
  agendaNav: NavigationProp<ParamListBase>,
  staffAgendaParams: StaffAgendaNavParams,
): void {
  agendaNav.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: AppointmentsStack.StaffAgendaList },
        {
          name: AppointmentsStack.StaffAgendaCalendar,
          params: staffAgendaParams,
        },
      ],
    }),
  );
}

/**
 * Após registo assistido sem returnToStaffAgenda: volta ao root da Agenda.
 */
export function resetAgendaStackToRoot(
  agendaNav: NavigationProp<ParamListBase>,
): void {
  agendaNav.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: AppointmentsStack.StaffAgendaList }],
    }),
  );
}
