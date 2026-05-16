import { View } from 'react-native';
import { TOKENS } from '../data/tokens';

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
      style={{
        width: '100%',
        height,
        backgroundColor: 'rgba(26,22,20,0.08)',
        borderRadius: height,
        overflow: 'hidden',
      }}
    >
      <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
    </View>
  );
}
