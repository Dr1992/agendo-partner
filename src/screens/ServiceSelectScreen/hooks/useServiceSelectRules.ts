import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useCallback, useLayoutEffect } from "react";

import { navigateFromServiceSelectToSchedule } from "../../../navigation/staffBookingNavigate";
import type { ServiceSelectScreenProps } from "../types";

export function useServiceSelectRules(
  navigation: ServiceSelectScreenProps["navigation"],
  routeParams: ServiceSelectScreenProps["route"]["params"],
) {
  const {
    bookingFlowOrigin,
    defaultPerformerUserId,
    establishmentId,
    returnToStaffAgenda,
  } = routeParams;

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Agendar para cliente" });
  }, [navigation]);

  const headerHint =
    "Escolha o serviço para este atendimento. Na confirmação, indique o e-mail da conta do cliente na app.";

  const onServicePress = useCallback(
    (serviceId: string) => {
      navigateFromServiceSelectToSchedule(
        navigation as NavigationProp<ParamListBase>,
        {
          bookingFlowOrigin,
          defaultPerformerUserId,
          establishmentId,
          returnToStaffAgenda,
          serviceId,
          staffAssistedBooking: true,
        },
      );
    },
    [
      bookingFlowOrigin,
      defaultPerformerUserId,
      establishmentId,
      navigation,
      returnToStaffAgenda,
    ],
  );

  return {
    headerHint,
    onServicePress,
  };
}
