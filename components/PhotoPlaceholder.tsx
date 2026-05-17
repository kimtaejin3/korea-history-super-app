import { View, Text, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

type Props = {
  label?: string;
  height?: number;
  width?: number | string;
  style?: ViewStyle;
};

export function PhotoPlaceholder({ label = 'photo', height = 200, width = '100%', style }: Props) {
  return (
    <View
      className="bg-[#ECECEA] items-center justify-center overflow-hidden"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={[{ height, width: width as any }, style]}
    >
      <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(20,20,22,0.06)" strokeWidth="0.5" />
        <Line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(20,20,22,0.06)" strokeWidth="0.5" />
      </Svg>
      <Text className="font-mono text-[9px] tracking-wider text-[rgba(20,20,22,0.45)] px-2 py-0.5">
        {label}
      </Text>
    </View>
  );
}
