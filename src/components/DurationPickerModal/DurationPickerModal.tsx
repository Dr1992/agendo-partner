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
  return (
    <HourMinutePickerModal
      initialMinutes={initialMinutes}
      mode="duration"
      title="Duração"
      visible={visible}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
