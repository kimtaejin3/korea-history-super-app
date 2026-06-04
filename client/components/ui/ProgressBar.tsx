import { View } from 'react-native';
import { TOKENS } from '../../lib/tokens';

type Props = {
  value: number;
  max: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, max, color = TOKENS.ink, height = 3 }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <View
      className="w-full bg-[rgba(26,22,20,0.08)] overflow-hidden"
      style={{ height, borderRadius: height }}
    >
      <View className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </View>
  );
}
