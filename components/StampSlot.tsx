import { View } from 'react-native';
import { TOKENS } from '../data/tokens';

export function StampSlot({ size = 56 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(20,20,22,0.15)',
        backgroundColor: 'rgba(26,22,20,0.025)',
      }}
    />
  );
}
