import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { stampedQueryOptions, recentStampsQueryOptions } from '../../queries/stamps';
import { SectionLabel } from '../SectionLabel';
import { Stamp } from '../Stamp';

export function MyJourneySection() {
  const router = useRouter();
  // stamped + recentStamps를 한 useSuspenseQueries로 묶어 병렬 발사 (waterfall 방지).
  const [{ data: stamped }, { data: recentStamps }] = useSuspenseQueries({
    queries: [stampedQueryOptions(), recentStampsQueryOptions(6)],
  });
  const myStamps = stamped.length;

  return (
    <>
      <SectionLabel>나의 발자취 · MY JOURNEY</SectionLabel>
      <View className="px-5">
        <View className="bg-paper border border-line rounded-xl p-[18px]">
          <View className="flex-row items-end gap-4">
            <View>
              <Text className="font-serif-black text-[44px] text-ink leading-[44px] tracking-[-2px]">
                {myStamps}
              </Text>
              <Text className="font-sans text-[11px] text-mute mt-1 tracking-wide">
                획득한 스탬프
              </Text>
            </View>
            <View className="flex-1 flex-row gap-1 pb-1">
              {recentStamps.map((s, i) => (
                <Stamp
                  key={s.id}
                  glyph={s.glyph}
                  size={32}
                  rotate={-8 + i * 3}
                  color={s.accent}
                />
              ))}
            </View>
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
