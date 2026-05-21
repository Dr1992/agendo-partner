import { StyleSheet } from "react-native";

import type { AppTheme } from "../../../theme";

type PartnerHomeStylesOptions = {
  /** Padding inferior do rodapé fixo (ex.: `insets.bottom + 16`, alinhado a outros ecrãs). */
  footerPadBottom: number;
};

/** Altura reservada no scroll para o bloco do botão (padding + CTA ~52–56px + margem). */
const SCROLL_EXTRA_FOR_FIXED_FOOTER = 88;

export function getPartnerHomeStyles(
  theme: AppTheme,
  opts: PartnerHomeStylesOptions,
) {
  return StyleSheet.create({
    establishmentListCardSpacing: {
      marginTop: 10,
    },
    sectionHeading: {
      marginTop: 20,
    },
    emptyPartnerMessage: {
      textAlign: "center",
    },
    fixedFooter: {
      alignSelf: "stretch",
      backgroundColor: theme.background,
      borderTopColor: theme.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingBottom: opts.footerPadBottom,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    fixedFooterButton: {
      marginTop: 0,
    },
    scrollContentWithFixedFooter: {
      paddingBottom: SCROLL_EXTRA_FOR_FIXED_FOOTER + opts.footerPadBottom,
    },
    scrollContentCenteredEmpty: {
      flexGrow: 1,
      justifyContent: "center",
    },
    gateText: {
      textAlign: "center",
    },
  });
}
