import { useTranslation } from "react-i18next";

import { HourMinutePickerModal } from "../HourMinutePickerModal/HourMinutePickerModal";

export type DurationPickerModalProps = {
  initialMinutes: number;
  onClose: () => void;
  onConfirm: (totalMinutes: number) => void;
  visible: boolean;
};

export function DurationPickerModal({
  initialMinutes,
  onClose,
  onConfirm,
  visible,
}: DurationPickerModalProps) {
  const { t } = useTranslation("components");
  return (
    <HourMinutePickerModal
      initialMinutes={initialMinutes}
      mode="duration"
      title={t("durationPicker.title")}
      visible={visible}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
