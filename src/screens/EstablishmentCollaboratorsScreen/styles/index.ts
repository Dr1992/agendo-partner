import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";
import { alpha, palette } from "../../../theme/colors";

export function getEstablishmentCollaboratorsScreenStyles(theme: AppTheme) {
  return StyleSheet.create({
    ownerCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 20,
      padding: 16,
    },
    ownerCardBody: {
      marginTop: 8,
    },
    ownerCardCpfHint: {
      marginTop: 10,
    },
    ownerCardButton: {
      marginTop: 14,
    },
    ownerCardIconRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    ownerCardTitleBlock: {
      flex: 1,
    },
    flatList: {
      flex: 1,
    },
    /** Rodapé dentro do `FlatList` (sempre visível por baixo dos itens). */
    footerInList: {
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      marginTop: 8,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    footerButton: {
      marginTop: 0,
    },
    hintBlock: {
      marginTop: 20,
    },
    pressed: {
      opacity: 0.92,
    },
    teamRowActions: {
      alignItems: "center",
      flexDirection: "row",
    },
    teamIconBtn: {
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    teamBlock: {
      marginTop: 8,
    },
    /** Espaço entre o texto da secção Equipe e o primeiro item da lista. */
    teamSectionHint: {
      marginBottom: 20,
    },
    teamSectionHeaderRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    teamSectionTitle: {
      color: theme.textPrimary,
      fontSize: 17,
      fontWeight: "800",
      letterSpacing: -0.25,
    },
    listSeparator: {
      backgroundColor: theme.border,
      height: StyleSheet.hairlineWidth,
    },
    teamRow: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    teamRowMain: {
      alignItems: "center",
      flex: 1,
      flexDirection: "row",
      gap: 12,
      marginRight: 12,
      minWidth: 0,
    },
    teamRoleIconWrap: {
      alignItems: "center",
      justifyContent: "center",
      width: 28,
    },
    teamRowText: {
      flex: 1,
      minWidth: 0,
    },
    screenBody: {
      flex: 1,
    },
    pendingCard: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 20,
      padding: 16,
    },
    pendingHeaderRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
    },
    pendingTitle: {
      color: theme.textPrimary,
      flex: 1,
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: -0.25,
    },
    pendingCardSummary: {
      marginTop: 8,
    },
    pendingOpenModalBtn: {
      marginTop: 14,
    },
    pendingModalScroll: {
      flex: 1,
      minHeight: 0,
    },
    /** Sobrepõe `marginTop` da variante `hint` para alinhar com o ícone. */
    pendingModalMetaText: {
      flex: 1,
      marginTop: 0,
      minWidth: 0,
    },
    pendingModalItemBlock: {
      paddingVertical: 4,
    },
    pendingModalItemTop: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 10,
      justifyContent: "space-between",
    },
    pendingModalItemBody: {
      flex: 1,
      minWidth: 0,
    },
    pendingModalMetaRow: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 10,
      marginTop: 10,
    },
    pendingModalMetaRowFirst: {
      marginTop: 0,
    },
    /** Altura ≈ `lineHeight` do `bodyTight` (22) para centrar o glifo na primeira linha. */
    pendingModalMetaIconLead: {
      alignItems: "center",
      height: 22,
      justifyContent: "center",
      width: 26,
    },
    /** Altura ≈ `lineHeight` do `hint` (20). */
    pendingModalMetaIconMuted: {
      alignItems: "center",
      height: 20,
      justifyContent: "center",
      width: 26,
    },
    pendingModalTrashBtn: {
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
      minWidth: 44,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    /** Linha entre um convite e o seguinte no sheet. */
    pendingModalSectionDivider: {
      alignSelf: "stretch",
      backgroundColor: theme.border,
      height: StyleSheet.hairlineWidth,
      marginVertical: 16,
    },
    pendingModalLinkBtn: {
      alignSelf: "stretch",
      marginTop: 14,
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    /** Confirmação de revogar dentro do sheet (um único Modal nativo). */
    pendingModalBodyWrap: {
      flex: 1,
      minHeight: 0,
    },
    pendingRevokeActions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 20,
    },
    pendingRevokeBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: alpha.overlayScrim,
    },
    pendingRevokeCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      elevation: 6,
      maxWidth: 400,
      paddingHorizontal: 20,
      paddingVertical: 20,
      shadowColor: theme.cardShadow,
      shadowOffset: { height: 8, width: 0 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      width: "100%",
    },
    pendingRevokeDestructiveBtn: {
      alignItems: "center",
      backgroundColor: palette.red700,
      borderRadius: 14,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    pendingRevokeDestructiveLabel: {
      color: palette.white,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    pendingRevokeMessage: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginTop: 10,
    },
    pendingRevokeOutlineBtn: {
      alignItems: "center",
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderRadius: 14,
      borderWidth: 1,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    pendingRevokeOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    pendingRevokeTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: "700",
    },
  });
}
