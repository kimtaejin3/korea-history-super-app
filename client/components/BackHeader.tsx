import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { TOKENS } from '../data/tokens';
import { BackIcon } from './icons';

type Props = {
  title?: string;
  overlay?: boolean;
  trailing?: ReactNode;
};

export function BackHeader({ title, overlay = false, trailing }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className={`flex-row items-center justify-between px-4 pb-3 z-10 ${overlay ? 'absolute top-0 left-0 right-0' : 'relative'}`}
      style={{ paddingTop: insets.top + 8 }}
    >
      <Pressable
        onPress={() => router.back()}
        className={`w-9 h-9 rounded-full items-center justify-center ${overlay ? 'bg-white/[0.18]' : 'bg-[rgba(26,22,20,0.05)]'}`}
      >
        <BackIcon color={overlay ? TOKENS.paper : TOKENS.ink} />
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
