import { View, Text } from 'react-native';
import { FONTS, TOKENS } from '../data/tokens';

type Props = {
  children: string;
  color?: string;
  filled?: boolean;
};

export function Tag({ children, color = TOKENS.ink, filled = false }: Props) {
  return (
    <View
      style={{
        paddingVertical: 3,
        paddingHorizontal: 7,
        borderWidth: filled ? 0 : 0.8,
        borderColor: color + '55',
        backgroundColor: filled ? color : 'transparent',
        borderRadius: 2,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.sans,
          fontSize: 11,
          color: filled ? TOKENS.paper : color,
          letterSpacing: 0.2,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
