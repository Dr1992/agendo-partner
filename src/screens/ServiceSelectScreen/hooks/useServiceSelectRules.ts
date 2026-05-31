import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useCallback, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

import { navigateFromServiceSelectToSchedule } from "../../../navigation/staffBookingNavigate";
import type { ServiceSelectScreenProps } from "../types";

export function useServiceSelectRules(
  navigation: ServiceSelectScreenProps["navigation"],
  routeParams: ServiceSelectScreenProps["route"]["params"],
) {
  const { t } = useTranslation("booking");
  const {
    bookingFlowOrigin,
    defaultPerformerUserId,
    establishmentId,
    returnToStaffAgenda,
  } = routeParams;

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("serviceSelect.navTitle") });
  }, [navigation, t]);

  const headerHint = t("serviceSelect.headerHint");

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
