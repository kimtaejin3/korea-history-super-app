import { View, Text } from 'react-native';
import Svg, { Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { FONTS, TOKENS } from '../data/tokens';

type Props = {
  glyph?: string;
  size?: number;
  rotate?: number;
  dim?: boolean;
  color?: string;
};

export function Stamp({
  glyph = '印',
  size = 56,
  rotate = -6,
  dim = false,
  color = TOKENS.red,
}: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        transform: [{ rotate: `${rotate}deg` }],
        alignItems: 'center',
        justifyContent: 'center',
        opacity: dim ? 0.18 : 1,
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          <RadialGradient id="ink" cx="30%" cy="20%" r="80%">
            <Stop offset="0%" stopColor="#fff" stopOpacity="0.12" />
            <Stop offset="60%" stopColor="#fff" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0.15" />
          </RadialGradient>
        </Defs>
        <Rect x="2" y="2" width="52" height="52" rx="4" fill={color} fillOpacity={0.92} />
        <Rect x="2" y="2" width="52" height="52" rx="4" fill="url(#ink)" />
      </Svg>
      <Text
        style={{
          fontFamily: FONTS.serifBlack,
          fontSize: size * 0.46,
          color: '#FAF7F0',
          lineHeight: size * 0.5,
        }}
      >
        {glyph}
      </Text>
    </View>
  );
}
