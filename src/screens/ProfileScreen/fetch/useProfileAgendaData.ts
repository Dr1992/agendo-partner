import { useFetchStaffAgendaEstablishments } from "../../../hooks/api/useFetchStaffAgendaEstablishments";
import { useAuth } from "../../../providers/AuthProvider";

/** Agenda de estabelecimentos onde o utilizador é colaborador — para secção “Meus horários”. */
export function useProfileAgendaData() {
  const { profileComplete, session } = useAuth();
  return useFetchStaffAgendaEstablishments({
    enabled: Boolean(session?.accessToken && profileComplete),
    userId: session?.userId,
  });
}
