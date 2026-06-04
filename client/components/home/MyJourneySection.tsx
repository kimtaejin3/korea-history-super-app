import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { stampedQueryOptions } from '../../queries/stamps';
import { SectionLabel } from '../ui/SectionLabel';

export function MyJourneySection() {
  const router = useRouter();
  const [{ data: stamped }] = useSuspenseQueries({
    queries: [stampedQueryOptions()],
  });
  const myStamps = stamped.length;

  return (
    <>
      <SectionLabel>나의 발자취 · MY JOURNEY</SectionLabel>
      <View className="px-5">
        <View className="bg-paper border border-line rounded-xl p-[18px]">
          <View>
            <Text className="font-serif-black text-[44px] text-ink leading-[44px] tracking-[-2px]">
              {myStamps}
            </Text>
            <Text className="font-sans text-[11px] text-mute mt-1 tracking-wide">
              획득한 스탬프
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/stampbook' as never)}
            className="mt-3.5 p-3 bg-ink rounded-lg items-center"
          >
            <Text className="font-sans-bold text-[13px] text-paper tracking-[0.2px]">
              스탬프북 펼치기
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
