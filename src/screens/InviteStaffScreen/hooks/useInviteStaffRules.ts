import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import { useCallback, useMemo, useRef, useState } from "react";
import type { TFunction } from "i18next";

import { createStaffInvite } from "../../../api/public/partner";
import type { ProfileScreenProps } from "../../../navigation/profileNavigation.types";
import { ProfileStack } from "../../../navigation/routeIds";
import { useAuth } from "../../../providers/AuthProvider";
import type { EstablishmentDetail } from "../../../types/establishment";
import { isValidCpf } from "../../../utils/cpf";

export function useInviteStaffRules(
  navigation: ProfileScreenProps<"InviteStaff">["navigation"],
  establishmentId: string,
  establishmentName: string,
  est: EstablishmentDetail | undefined,
  t: TFunction<"team">,
) {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [cpfDigits, setCpfDigits] = useState("");
  const [inviteRole, setInviteRole] = useState<"MANAGER" | "STAFF">("STAFF");
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [inviteDialog, setInviteDialog] = useState<{
    goBackOnOk?: boolean;
    message: string;
    title: string;
  } | null>(null);

  const inviteDialogRef = useRef(inviteDialog);
  inviteDialogRef.current = inviteDialog;

  const canManage =
    est?.viewerMemberRole === "OWNER" || est?.viewerMemberRole === "MANAGER";

  const cpfValid = useMemo(() => isValidCpf(cpfDigits), [cpfDigits]);

  const inviteMutation = useMutation({
    mutationFn: async (input: {
      digits: string;
      role: "MANAGER" | "STAFF";
    }) => {
      if (!session?.accessToken) {
        throw new Error(t("invite.noSession"));
      }
      return createStaffInvite(establishmentId, input.digits, input.role);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      await queryClient.invalidateQueries({
        queryKey: ["partner", "agenda-establishments"],
      });
    },
  });

  const closeInviteDialog = useCallback(() => {
    const goBack = inviteDialogRef.current?.goBackOnOk;
    setInviteDialog(null);
    if (goBack) {
      navigation.goBack();
    }
  }, [navigation]);

  const onSend = useCallback(async () => {
    if (!session || !canManage || !est) {
      return;
    }
    if (!cpfValid) {
      setInviteDialog({
        title: t("invite.dialog.invalidCpfTitle"),
        message: t("invite.dialog.invalidCpfMessage"),
      });
      return;
    }
    setBusy(true);
    try {
      const roleToSend =
        est.viewerMemberRole === "OWNER" ? inviteRole : "STAFF";
      const res = await inviteMutation.mutateAsync({
        digits: cpfDigits,
        role: roleToSend,
      });
      if ("inviteSkipped" in res && res.inviteSkipped) {
        setInviteDialog({
          title: t("invite.dialog.allSetTitle"),
          message: res.message,
          goBackOnOk: true,
        });
      } else if ("id" in res) {
        navigation.navigate(ProfileStack.InviteStaffNextSteps, {
          establishmentId,
          establishmentName,
          inviteId: res.id,
          inviteeAccountExists: res.inviteeAccountExists,
          autoAccepted: res.autoAccepted,
        });
      }
    } catch (e) {
      setInviteDialog({
        title: t("invite.dialog.errorTitle"),
        message:
          e instanceof Error ? e.message : t("invite.dialog.errorFallback"),
      });
    } finally {
      setBusy(false);
    }
  }, [
    cpfDigits,
    cpfValid,
    canManage,
    est,
    establishmentId,
    establishmentName,
    inviteMutation,
    inviteRole,
    navigation,
    session,
    t,
  ]);

  return {
    busy,
    canManage,
    closeInviteDialog,
    cpfDigits,
    cpfValid,
    inviteDialog,
    inviteRole,
    onSend,
    rolePickerOpen,
    setCpfDigits,
    setInviteRole,
    setRolePickerOpen,
  };
}
