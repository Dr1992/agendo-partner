import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, useWindowDimensions, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { AppSheetModal } from "../../components/AppSheetModal/AppSheetModal";
import { Text } from "../../components/Text";
import { useAppTheme } from "../../hooks/useAppTheme";
import type { ProfileScreenProps } from "../../navigation/profileNavigation.types";
import type { Professional } from "../../types/professional";
import { useAuth } from "../../providers/AuthProvider";
import { getScreenFormStyles } from "../../components/ScreenForm";
import { useEstablishmentCollaboratorsData } from "./fetch/useEstablishmentCollaboratorsData";
import { useEstablishmentCollaboratorsRules } from "./hooks/useEstablishmentCollaboratorsRules";
import {
  CollaboratorsAlertDialogs,
  CollaboratorsErrorGate,
  CollaboratorsListFooter,
  CollaboratorsListHeader,
  CollaboratorsLoadingGate,
  CollaboratorsNoAccessGate,
  CollaboratorsPendingInvitesSheetContent,
  CollaboratorsStaffListRow,
} from "./components";
import { getEstablishmentCollaboratorsScreenStyles } from "./styles";

export function EstablishmentCollaboratorsScreen({
  navigation,
  route,
}: ProfileScreenProps<"EstablishmentCollaborators">) {
  const { establishmentId } = route.params;
  const { theme } = useAppTheme();
  const { t } = useTranslation("team");
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getScreenFormStyles(theme);
  const screenStyles = useMemo(
    () => getEstablishmentCollaboratorsScreenStyles(theme),
    [theme],
  );
  const pendingSheetMaxHeight = useMemo(
    () => Math.min(Math.round(windowHeight * 0.78), 560),
    [windowHeight],
  );
  const { profile, session } = useAuth();

  const {
    data: est,
    error,
    isError,
    isPending,
    refetch,
  } = useEstablishmentCollaboratorsData(establishmentId);

  const {
    canManage,
    confirmRemoveMember,
    confirmRevokeInvite,
    deleteInvitePending,
    executeIncludeOwnerAsStaff,
    includeOwnerPending,
    includeSelfDialogOpen,
    onIncludeOwnerAsStaffPress,
    onRemoveMember,
    openPendingInvitesSheet,
    ownerHasValidCpf,
    pendingModalOpen,
    removeStaffPending,
    removeTarget,
    revokeInviteId,
    setIncludeSelfDialogOpen,
    setPendingModalOpen,
    setRemoveTarget,
    setRevokeInviteId,
    setTeamFeedback,
    showOwnerSelfServeCard,
    teamFeedback,
  } = useEstablishmentCollaboratorsRules({
    est,
    establishmentId,
    profileCpf: profile?.cpf ?? "",
    refetch,
    sessionUserId: session?.userId,
    t,
  });

  const renderStaffRow = useCallback(
    ({ item }: { item: Professional }) => (
      <CollaboratorsStaffListRow
        member={item}
        removeStaffPending={removeStaffPending}
        screenStyles={screenStyles}
        sessionUserId={session?.userId}
        theme={theme}
        onRemoveMember={onRemoveMember}
      />
    ),
    [onRemoveMember, removeStaffPending, screenStyles, session?.userId, theme],
  );

  const listHeader = useMemo(() => {
    if (!est || !canManage) {
      return null;
    }
    return (
      <CollaboratorsListHeader
        establishment={est}
        includeOwnerPending={includeOwnerPending}
        navigation={navigation}
        onIncludeOwnerAsStaffPress={onIncludeOwnerAsStaffPress}
        openPendingInvitesSheet={openPendingInvitesSheet}
        ownerHasValidCpf={ownerHasValidCpf}
        screenStyles={screenStyles}
        showOwnerSelfServeCard={showOwnerSelfServeCard}
        theme={theme}
      />
    );
  }, [
    canManage,
    est,
    includeOwnerPending,
    navigation,
    onIncludeOwnerAsStaffPress,
    openPendingInvitesSheet,
    ownerHasValidCpf,
    screenStyles,
    showOwnerSelfServeCard,
    theme,
  ]);

  const listEmpty = useMemo(() => {
    if (!canManage || !est || est.professionals.length > 0) {
      return null;
    }
    return <Text variant="hint">{t("collaborators.emptyList")}</Text>;
  }, [canManage, est, t]);

  const flatData = useMemo(
    () => (canManage && est ? est.professionals : []),
    [canManage, est],
  );

  const showAddStaffFooter = Boolean(canManage && est);

  const footerPaddingBottom = useMemo(
    () => 20 + insets.bottom,
    [insets.bottom],
  );

  const listFooter = useMemo(() => {
    if (!showAddStaffFooter || !est) {
      return null;
    }
    return (
      <CollaboratorsListFooter
        establishment={est}
        footerPaddingBottom={footerPaddingBottom}
        navigation={navigation}
        screenStyles={screenStyles}
      />
    );
  }, [est, footerPaddingBottom, navigation, screenStyles, showAddStaffFooter]);

  if (isPending && est === undefined) {
    return <CollaboratorsLoadingGate styles={styles} />;
  }

  if (isError || !est) {
    return (
      <CollaboratorsErrorGate
        error={error}
        isError={isError}
        styles={styles}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!canManage) {
    return <CollaboratorsNoAccessGate styles={styles} />;
  }

  const includeStaffBusy = includeOwnerPending;

  return (
    <SafeAreaView edges={[]} style={styles.container}>
      <CollaboratorsAlertDialogs
        confirmRemoveMember={confirmRemoveMember}
        executeIncludeOwnerAsStaff={executeIncludeOwnerAsStaff}
        includeSelfDialogOpen={includeSelfDialogOpen}
        includeStaffBusy={includeStaffBusy}
        removeStaffPending={removeStaffPending}
        removeTarget={removeTarget}
        setIncludeSelfDialogOpen={setIncludeSelfDialogOpen}
        setRemoveTarget={setRemoveTarget}
        setTeamFeedback={setTeamFeedback}
        teamFeedback={teamFeedback}
      />
      <AppSheetModal
        contentPaddingH={20}
        maxHeightPx={pendingSheetMaxHeight}
        title={t("collaborators.pendingSheetTitle")}
        visible={Boolean(est && pendingModalOpen)}
        onRequestClose={() => {
          setRevokeInviteId(null);
          setPendingModalOpen(false);
        }}
      >
        <CollaboratorsPendingInvitesSheetContent
          confirmRevokeInvite={confirmRevokeInvite}
          deleteInvitePending={deleteInvitePending}
          establishment={est}
          navigation={navigation}
          revokeInviteId={revokeInviteId}
          screenStyles={screenStyles}
          setPendingModalOpen={setPendingModalOpen}
          setRevokeInviteId={setRevokeInviteId}
          theme={theme}
        />
      </AppSheetModal>
      <View style={screenStyles.screenBody}>
        <FlatList
          ItemSeparatorComponent={() => (
            <View style={screenStyles.listSeparator} />
          )}
          ListEmptyComponent={listEmpty}
          ListFooterComponent={listFooter}
          ListHeaderComponent={listHeader}
          contentContainerStyle={styles.scrollContent}
          data={flatData}
          keyExtractor={(participant) => participant.id}
          keyboardShouldPersistTaps="handled"
          renderItem={renderStaffRow}
          style={screenStyles.flatList}
        />
      </View>
    </SafeAreaView>
  );
}
