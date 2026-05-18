// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { BackHeader } from '../../components/BackHeader';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { SectionLabel } from '../../components/SectionLabel';
import { RewardIcon } from '../../components/icons';

export default function ThemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const themeQuery = useQuery({ queryKey: queryKeys.theme(id), queryFn: () => api.theme(id), enabled: !!id });
  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });

  if (themeQuery.isError || (themeQuery.isFetched && !themeQuery.data)) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader title="테마를 찾을 수 없어요" />
      </View>
    );
  }
  if (!themeQuery.data || !placesQuery.data || !stampedQuery.data) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader />
      </View>
    );
  }
  const t = themeQuery.data;
  const PLACES = placesQuery.data;
  const STAMPED = stampedQuery.data;
  const places = t.placeIds
    .map((pid) => PLACES.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const pct = (t.visited / t.totalPlaces) * 100;

  return (
    <View className="flex-1 bg-paper">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 커버 */}
        <LinearGradient
          colors={t.cover}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 320, position: 'relative', overflow: 'hidden' }}
        >
          <BackHeader overlay />
          <View className="absolute left-0 right-0 bottom-0 px-5 pb-6">
            <Text className="font-serif-regular text-[11px] text-white/80 tracking-[3px]">
              {t.subtitle.toUpperCase()}
            </Text>
            <Text className="font-serif text-[34px] text-paper mt-1 leading-[38px] tracking-[-0.5px]">
              {t.title}
            </Text>
            <View className="flex-row items-center gap-2.5 mt-3.5">
              <Text className="font-mono-bold text-[13px] text-paper">
                {t.visited} / {t.totalPlaces}
              </Text>
              <View className="flex-1 h-0.5 bg-white/25 rounded-sm overflow-hidden">
                <View className="h-full bg-paper" style={{ width: `${pct}%` }} />
              </View>
              <Text className="font-mono-bold text-[13px] text-paper">{Math.round(pct)}%</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 설명 */}
        <View className="p-5 pb-6">
          <Text className="font-serif-regular text-[15px] text-inkSoft leading-[26px]">
            {t.desc}
          </Text>
        </View>

        {/* 보상 카드 */}
        <View className="px-5 pb-6">
          <View
            className="bg-paperWarm p-4 rounded flex-row items-center gap-3.5"
            style={{ borderWidth: 0.5, borderColor: `${t.color}40` }}
          >
            <LinearGradient
              colors={t.cover}
              style={{ width: 56, height: 56, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}
            >
              <RewardIcon />
            </LinearGradient>
            <View className="flex-1">
              <Text
                className="font-sans-bold text-[10px] tracking-[1.5px]"
                style={{ color: t.color }}
              >
                완성 시 보상
              </Text>
              <Text className="font-serif text-[15px] text-ink mt-0.5">{t.rewardGoods}</Text>
              <Text className="font-sans text-[11px] text-mute mt-0.5">
                + &quot;{t.badge}&quot; 칭호 획득
              </Text>
            </View>
          </View>
        </View>

        {/* 장소 타임라인 */}
        <SectionLabel
          action={<Text className="font-sans-bold text-[11px] text-mute">코스 순서대로</Text>}
        >
          {`이 테마의 장소들 · ${t.totalPlaces}곳`}
        </SectionLabel>

        <View className="px-5 relative">
          <View
            className="absolute w-px bg-line"
            style={{ left: 20 + 15, top: 26, bottom: 26 }}
          />
          {places.map((p, i) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/place/${p.id}` as never)}
              className="flex-row gap-4 items-start py-3.5"
            >
              <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{
                  backgroundColor: STAMPED.includes(p.id) ? t.color : TOKENS.paper,
                  borderWidth: 1.5,
                  borderColor: t.color,
                }}
              >
                <Text
                  className="font-mono-bold text-xs"
                  style={{ color: STAMPED.includes(p.id) ? TOKENS.paper : t.color }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </View>
              <View className="flex-1 pt-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Tag color={p.accent}>{p.region}</Tag>
                  {STAMPED.includes(p.id) && (
                    <Text
                      className="font-sans-bold text-[10px]"
                      style={{ color: t.color }}
                    >
                      ● 방문 완료
                    </Text>
                  )}
                </View>
                <Text className="font-serif text-base text-ink">{p.name}</Text>
                <Text className="font-sans text-xs text-mute mt-0.5 leading-[18px]">
                  {p.summary}
                </Text>
              </View>
              {STAMPED.includes(p.id) && (
                <View className="pt-1">
                  <Stamp glyph={p.nameHanja[0]} size={36} rotate={-8} color={p.accent} />
                </View>
              )}
            </Pressable>
          ))}

          {/* 미답사 노드 */}
          {Array.from({ length: t.totalPlaces - places.length }).map((_, i) => {
            const idx = places.length + i;
            return (
              <View key={`x${i}`} className="flex-row gap-4 items-start py-3.5 opacity-50">
                <View className="w-8 h-8 rounded-full bg-paper border-[1.5px] border-line border-dashed items-center justify-center">
                  <Text className="font-mono text-xs text-mute">
                    {String(idx + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View className="flex-1 pt-1.5">
                  <Text className="font-serif-regular text-sm text-mute">미답사 장소</Text>
                  <Text className="font-sans text-[11px] text-mute mt-0.5">
                    방문하면 공개됩니다
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
