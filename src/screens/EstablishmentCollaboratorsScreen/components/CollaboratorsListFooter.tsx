import { View } from "react-native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";

import { Button } from "../../../components/Button";
import type { EstablishmentDetail } from "../../../types/establishment";
import { ProfileStack } from "../../../navigation/routeIds";
import { getEstablishmentCollaboratorsScreenStyles } from "../styles";

type ScreenStyles = ReturnType<
  typeof getEstablishmentCollaboratorsScreenStyles
>;

type CollaboratorsListFooterProps = {
  establishment: EstablishmentDetail;
  footerPaddingBottom: number;
  navigation: NavigationProp<ParamListBase>;
  screenStyles: ScreenStyles;
};

export function CollaboratorsListFooter({
  establishment,
  footerPaddingBottom,
  navigation,
  screenStyles,
}: CollaboratorsListFooterProps) {
  return (
    <View
      style={[
        screenStyles.footerInList,
        { paddingBottom: footerPaddingBottom },
      ]}
    >
      <Button
        style={screenStyles.footerButton}
        onPress={() =>
          navigation.navigate(ProfileStack.InviteStaff, {
            establishmentId: establishment.id,
            establishmentName: establishment.name,
          })
        }
      >
        Adicionar colaborador
      </Button>
    </View>
  );
}
