import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { FONTS, TOKENS } from '../data/tokens';

type Props = {
  title?: string;
  overlay?: boolean;
  trailing?: ReactNode;
};

export function BackHeader({ title, overlay = false, trailing }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bg = overlay ? 'rgba(255,255,255,0.18)' : 'rgba(26,22,20,0.05)';
  const stroke = overlay ? TOKENS.paper : TOKENS.ink;
  const titleColor = overlay ? TOKENS.paper : TOKENS.ink;

  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: overlay ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width="16" height="16" viewBox="0 0 22 22" fill="none">
          <Path
            d="M14 4l-7 7 7 7"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      {title ? (
        <Text
          style={{
            fontFamily: FONTS.sansBold,
            fontSize: 13,
            color: titleColor,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>
      ) : (
        <View />
      )}
      {trailing || <View style={{ width: 36 }} />}
    </View>
  );
}
