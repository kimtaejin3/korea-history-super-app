import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReactNode } from 'react';
import { FONTS, TOKENS } from '../data/tokens';

type Props = {
  title: string;
  hanja?: string;
  subtitle?: string;
  action?: ReactNode;
  dense?: boolean;
};

export function PageHeader({ title, hanja, subtitle, action, dense = false }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + (dense ? 12 : 16),
        paddingHorizontal: 20,
        paddingBottom: dense ? 12 : 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: dense ? 22 : 28,
              color: TOKENS.ink,
              letterSpacing: -0.5,
              lineHeight: dense ? 26 : 32,
            }}
          >
            {title}
          </Text>
          {hanja && (
            <Text
              style={{
                fontFamily: FONTS.serifRegular,
                fontSize: 12,
                color: TOKENS.mute,
                marginTop: 2,
                letterSpacing: 2,
              }}
            >
              {hanja}
            </Text>
          )}
          {subtitle && (
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 13,
                color: TOKENS.mute,
                marginTop: 6,
                letterSpacing: -0.2,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {action}
      </View>
    </View>
  );
}
