import { AlertDialog } from "../../../components/AlertDialog/AlertDialog";

type RemoveTarget = { id: string; name: string } | null;

type TeamFeedback = { message: string; title: string } | null;

type CollaboratorsAlertDialogsProps = {
  confirmRemoveMember: () => void;
  executeIncludeOwnerAsStaff: () => Promise<void>;
  includeSelfDialogOpen: boolean;
  includeStaffBusy: boolean;
  removeStaffPending: boolean;
  removeTarget: RemoveTarget;
  setIncludeSelfDialogOpen: (open: boolean) => void;
  setRemoveTarget: (target: RemoveTarget) => void;
  setTeamFeedback: (feedback: TeamFeedback) => void;
  teamFeedback: TeamFeedback;
};

export function CollaboratorsAlertDialogs({
  confirmRemoveMember,
  executeIncludeOwnerAsStaff,
  includeSelfDialogOpen,
  includeStaffBusy,
  removeStaffPending,
  removeTarget,
  setIncludeSelfDialogOpen,
  setRemoveTarget,
  setTeamFeedback,
  teamFeedback,
}: CollaboratorsAlertDialogsProps) {
  return (
    <>
      <AlertDialog
        buttons={[
          {
            label: "Voltar",
            onPress: () => {
              if (!includeStaffBusy) {
                setIncludeSelfDialogOpen(false);
              }
            },
            variant: "secondary",
          },
          {
            label: includeStaffBusy ? "A incluir…" : "Incluir",
            onPress: () => void executeIncludeOwnerAsStaff(),
            variant: "primary",
          },
        ]}
        message="Você passará a aparecer como prestador neste local e poderá ser escolhido nos agendamentos e nos serviços."
        title="Incluir você na equipe?"
        visible={includeSelfDialogOpen}
        onRequestClose={() => {
          if (!includeStaffBusy) {
            setIncludeSelfDialogOpen(false);
          }
        }}
      />
      {removeTarget ? (
        <AlertDialog
          buttons={[
            {
              label: "Cancelar",
              onPress: () => {
                if (!removeStaffPending) {
                  setRemoveTarget(null);
                }
              },
              variant: "secondary",
            },
            {
              label: removeStaffPending ? "A remover…" : "Remover",
              onPress: confirmRemoveMember,
              variant: "destructive",
            },
          ]}
          message={`Remover ${removeTarget.name} deste estabelecimento? A pessoa deixa de aparecer na equipe.`}
          title="Remover da equipe"
          visible
          onRequestClose={() => {
            if (!removeStaffPending) {
              setRemoveTarget(null);
            }
          }}
        />
      ) : null}
      {teamFeedback ? (
        <AlertDialog
          buttons={[
            {
              label: "OK",
              onPress: () => setTeamFeedback(null),
              variant: "primary",
            },
          ]}
          message={teamFeedback.message}
          title={teamFeedback.title}
          visible
          onRequestClose={() => setTeamFeedback(null)}
        />
      ) : null}
    </>
  );
}
