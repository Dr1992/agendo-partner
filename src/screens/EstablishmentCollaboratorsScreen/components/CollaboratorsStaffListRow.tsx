import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Text } from "../../../components/Text";
import type { AppTheme } from "../../../theme";
import type { Professional } from "../../../types/professional";
import { getEstablishmentCollaboratorsScreenStyles } from "../styles";

import { staffRoleIonIcon, staffRoleKey } from "./staffRoleHelpers";

type ScreenStyles = ReturnType<
  typeof getEstablishmentCollaboratorsScreenStyles
>;

type CollaboratorsStaffListRowProps = {
  member: Professional;
  onRemoveMember: (memberId: string, memberName: string) => void;
  removeStaffPending: boolean;
  screenStyles: ScreenStyles;
  sessionUserId: string | undefined;
  theme: AppTheme;
};

export function CollaboratorsStaffListRow({
  member,
  onRemoveMember,
  removeStaffPending,
  screenStyles,
  sessionUserId,
  theme,
}: CollaboratorsStaffListRowProps) {
  const { t } = useTranslation("team");
  const isSelf = sessionUserId != null && member.id === sessionUserId;
  const canRemove = !isSelf && !removeStaffPending;
  const roleIcon = staffRoleIonIcon(member.staffRole);

  return (
    <View style={screenStyles.teamRow}>
      <View
        accessibilityLabel={t("collaborators.row.accessibilityLabel", {
          name: member.name,
          role: t(staffRoleKey(member.staffRole)),
        })}
        accessible
        style={screenStyles.teamRowMain}
      >
        <View style={screenStyles.teamRoleIconWrap}>
          <Ionicons color={theme.accent} name={roleIcon} size={20} />
        </View>
        <View style={screenStyles.teamRowText}>
          <Text variant="bodyTight">{member.name}</Text>
        </View>
      </View>
      {canRemove ? (
        <View style={screenStyles.teamRowActions}>
          <Pressable
            accessibilityLabel={t(
              "collaborators.row.removeAccessibilityLabel",
              {
                name: member.name,
              },
            )}
            accessibilityRole="button"
            hitSlop={8}
            style={({ pressed }) => [
              screenStyles.teamIconBtn,
              pressed && screenStyles.pressed,
            ]}
            onPress={() => onRemoveMember(member.id, member.name)}
          >
            <Ionicons
              color={theme.textDestructive}
              name="trash-outline"
              size={22}
            />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
