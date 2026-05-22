import { View } from 'react-native';

export function StampSlot({ size = 56 }: { size?: number }) {
  return (
    <View
      className="rounded-xl border border-dashed border-[rgba(20,20,22,0.15)] bg-[rgba(26,22,20,0.025)]"
      style={{ width: size, height: size }}
    />
  );
}
