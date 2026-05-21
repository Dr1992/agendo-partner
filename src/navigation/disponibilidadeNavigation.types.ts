import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type DisponibilidadeStackParamList = {
  DisponibilidadeList: undefined;
  StaffAgendaDetail: { establishmentId: string; establishmentName: string };
};

export type DisponibilidadeScreenProps<
  T extends keyof DisponibilidadeStackParamList,
> = NativeStackScreenProps<DisponibilidadeStackParamList, T>;
