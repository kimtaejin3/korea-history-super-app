// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../lib/api';
import { BackHeader } from '../../components/BackHeader';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { Tag } from '../../components/Tag';
import { SectionLabel } from '../../components/SectionLabel';

export default function FigureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const figureQuery = useQuery({ queryKey: queryKeys.figure(id), queryFn: () => api.figure(id), enabled: !!id });
  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const artifactsQuery = useQuery({ queryKey: queryKeys.artifacts, queryFn: api.artifacts });

  if (figureQuery.isError || (figureQuery.isFetched && !figureQuery.data)) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader title="인물을 찾을 수 없어요" />
      </View>
    );
  }
  if (!figureQuery.data || !placesQuery.data || !artifactsQuery.data) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader />
      </View>
    );
  }
  const f = figureQuery.data;
  const PLACES = placesQuery.data;
  const ARTIFACTS = artifactsQuery.data;
  const linkedPlaces = f.placeIds
    .map((pid) => PLACES.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const linkedArtifacts = ARTIFACTS.filter((a) => linkedPlaces.some((p) => p.id === a.placeId));

  return (
    <View className="flex-1 bg-paper">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 히어로 */}
        <LinearGradient
          colors={[f.accent, '#1A1614']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 320, position: 'relative', overflow: 'hidden' }}
        >
          <BackHeader overlay />
          <View className="absolute left-0 right-0 bottom-0 px-5 pb-6">
            <Text className="font-sans-bold text-xs text-white/70 tracking-[3px]">
              {f.title.toUpperCase()}
            </Text>
            <Text className="font-serif text-[42px] text-paper mt-1.5 leading-[42px] tracking-[-1px]">
              {f.name}
            </Text>
            <View className="flex-row items-center gap-2 mt-3.5">
              <Text className="font-mono-bold text-xs text-paper">{f.years}</Text>
              <View className="px-2 py-0.5 rounded-sm bg-white/15">
                <Text className="font-sans-bold text-[11px] text-white/90">{f.era}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 요약 */}
        <View className="p-5">
          <Text className="font-serif text-base text-inkSoft leading-7 tracking-[-0.2px]">
            {f.summary}
          </Text>
        </View>

        {/* 본문 */}
        <View className="px-5 pb-6">
          <Text className="font-serif-regular text-sm text-inkSoft leading-[26px] tracking-[-0.2px]">
            {f.story}
          </Text>
        </View>

        {/* 연표 */}
        <SectionLabel>일생 · TIMELINE</SectionLabel>
        <View className="px-5 pb-6 relative">
          <View
            className="absolute w-px bg-line"
            style={{ left: 20 + 56, top: 16, bottom: 16 }}
          />
          {f.timeline.map((t, i) => (
            <View key={i} className="flex-row gap-4 items-start py-2.5">
              <Text
                className="font-mono-bold text-xs w-10 text-right pt-1.5"
                style={{ color: f.accent }}
              >
                {t.year}
              </Text>
              <View
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: f.accent }}
              />
              <Text className="flex-1 font-serif text-sm text-ink leading-[21px] pt-0.5">
                {t.event}
              </Text>
            </View>
          ))}
        </View>

        {/* 발자취 */}
        {linkedPlaces.length > 0 && (
          <>
            <SectionLabel>발자취 · RELATED PLACES</SectionLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              style={{ marginBottom: 24 }}
            >
              {linkedPlaces.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => router.push(`/place/${p.id}` as never)}
                  className="w-[220px] border border-line rounded-xl overflow-hidden bg-paper"
                >
                  <PhotoPlaceholder height={110} />
                  <View className="p-3.5">
                    <Tag color={p.accent}>{p.region}</Tag>
                    <Text className="font-serif text-[15px] text-ink mt-1.5">{p.name}</Text>
                    <Text numberOfLines={2} className="font-sans text-[11px] text-mute mt-0.5 leading-4">
                      {p.summary}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* 관련 유물 */}
        {linkedArtifacts.length > 0 && (
          <>
            <SectionLabel>관련 유물 · ARTIFACTS</SectionLabel>
            <View className="px-5 gap-2">
              {linkedArtifacts.map((a) => (
                <Pressable
                  key={a.id}
                  onPress={() => router.push(`/artifact/${a.id}` as never)}
                  className="flex-row gap-3 p-3 bg-paper border border-line rounded-xl items-center"
                >
                  <PhotoPlaceholder height={64} width={64} />
                  <View className="flex-1">
                    <Text
                      className="font-sans-bold text-[10px] tracking-wider"
                      style={{ color: a.accent }}
                    >
                      {a.designation}
                    </Text>
                    <Text className="font-serif text-sm text-ink mt-0.5">{a.name}</Text>
                    <Text className="font-sans text-[11px] text-mute mt-0.5">{a.period}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
