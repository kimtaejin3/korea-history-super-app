import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { TOKENS } from '../data/tokens';

type Props = {
  title?: string;
  overlay?: boolean;
  trailing?: ReactNode;
};

export function BackHeader({ title, overlay = false, trailing }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const stroke = overlay ? TOKENS.paper : TOKENS.ink;

  return (
    <View
      className={`flex-row items-center justify-between px-4 pb-3 z-10 ${overlay ? 'absolute top-0 left-0 right-0' : 'relative'}`}
      style={{ paddingTop: insets.top + 8 }}
    >
      <Pressable
        onPress={() => router.back()}
        className={`w-9 h-9 rounded-full items-center justify-center ${overlay ? 'bg-white/[0.18]' : 'bg-[rgba(26,22,20,0.05)]'}`}
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
          className={`font-sans-bold text-[13px] tracking-[0.5px] ${overlay ? 'text-paper' : 'text-ink'}`}
        >
          {title}
        </Text>
      ) : (
        <View />
      )}
      {trailing || <View className="w-9" />}
    </View>
  );
}
