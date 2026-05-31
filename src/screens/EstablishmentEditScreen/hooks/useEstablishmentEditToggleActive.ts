import type { NavigationProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "../../../hooks/api/reactQuery";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { updatePartnerEstablishment } from "../../../api/public/partner";
import { establishmentDetailQueryKey } from "../../../hooks/api/useFetchEstablishmentDetail";
import type { ProfileStackParamList } from "../../../navigation/profileNavigation.types";

type FeedbackDialogState = {
  message: string;
  onDismiss?: () => void;
  title: string;
} | null;

export function useEstablishmentEditToggleActive({
  establishmentId,
  navigation,
  setFeedbackDialog,
}: {
  establishmentId: string;
  navigation: NavigationProp<ProfileStackParamList>;
  setFeedbackDialog: Dispatch<SetStateAction<FeedbackDialogState>>;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("partner");
  const [toggleConfirm, setToggleConfirm] = useState<{
    nextActive: boolean;
  } | null>(null);

  const toggleActiveMutation = useMutation({
    mutationFn: (nextActive: boolean) =>
      updatePartnerEstablishment(establishmentId, { isActive: nextActive }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["partner"] });
      await queryClient.invalidateQueries({
        queryKey: establishmentDetailQueryKey(establishmentId),
      });
    },
  });

  const onToggleActive = useCallback((nextActive: boolean) => {
    setToggleConfirm({ nextActive });
  }, []);

  const confirmToggleActive = useCallback(() => {
    if (!toggleConfirm || toggleActiveMutation.isPending) {
      return;
    }
    const { nextActive } = toggleConfirm;
    void (async () => {
      try {
        await toggleActiveMutation.mutateAsync(nextActive);
        setToggleConfirm(null);
        setFeedbackDialog({
          title: nextActive
            ? t("edit.reactivatedTitle")
            : t("edit.deactivatedTitle"),
          message: nextActive
            ? t("edit.reactivatedMessage")
            : t("edit.deactivatedMessage"),
          onDismiss: () => navigation.goBack(),
        });
      } catch (e) {
        setToggleConfirm(null);
        setFeedbackDialog({
          title: t("common.errorTitle"),
          message:
            e instanceof Error ? e.message : t("edit.toggleErrorFallback"),
        });
      }
    })();
  }, [navigation, setFeedbackDialog, t, toggleActiveMutation, toggleConfirm]);

  return {
    confirmToggleActive,
    onToggleActive,
    setToggleConfirm,
    toggleActiveMutation,
    toggleConfirm,
  };
}
