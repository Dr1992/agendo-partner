import { createNavigationContainerRef } from "@react-navigation/native";

import type { PartnerMainTabParamList } from "../navigators/PartnerMainTabNavigator";

export const rootNavigationRef =
  createNavigationContainerRef<PartnerMainTabParamList>();
