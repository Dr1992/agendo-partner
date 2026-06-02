import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("team");
  return (
    <>
      <AlertDialog
        buttons={[
          {
            label: t("common.back"),
            onPress: () => {
              if (!includeStaffBusy) {
                setIncludeSelfDialogOpen(false);
              }
            },
            variant: "secondary",
          },
          {
            label: includeStaffBusy
              ? t("collaborators.includeSelfDialog.includingButton")
              : t("collaborators.includeSelfDialog.includeButton"),
            onPress: () => void executeIncludeOwnerAsStaff(),
            variant: "primary",
          },
        ]}
        message={t("collaborators.includeSelfDialog.message")}
        title={t("collaborators.includeSelfDialog.title")}
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
              label: t("common.cancel"),
              onPress: () => {
                if (!removeStaffPending) {
                  setRemoveTarget(null);
                }
              },
              variant: "secondary",
            },
            {
              label: removeStaffPending
                ? t("collaborators.removeDialog.removingButton")
                : t("collaborators.removeDialog.removeButton"),
              onPress: confirmRemoveMember,
              variant: "destructive",
            },
          ]}
          message={t("collaborators.removeDialog.message", {
            name: removeTarget.name,
          })}
          title={t("collaborators.removeDialog.title")}
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
              label: t("common.ok"),
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
