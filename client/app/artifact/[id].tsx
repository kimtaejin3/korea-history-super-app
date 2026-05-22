// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { BackHeader } from '../../components/BackHeader';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { Tag } from '../../components/Tag';
import { SectionLabel } from '../../components/SectionLabel';
import { ChevronRightIcon } from '../../components/icons';
import { formatDistance } from '../../lib/geo';

export default function ArtifactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const artifactQuery = useQuery({ queryKey: queryKeys.artifact(id), queryFn: () => api.artifact(id), enabled: !!id });
  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });

  if (artifactQuery.isError || (artifactQuery.isFetched && !artifactQuery.data)) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader title="유물을 찾을 수 없어요" />
      </View>
    );
  }
  if (!artifactQuery.data || !placesQuery.data) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader />
      </View>
    );
  }
  const a = artifactQuery.data;
  const place = placesQuery.data.find((p) => p.id === a.placeId);

  return (
    <View className="flex-1 bg-paper">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="relative">
          <PhotoPlaceholder height={340} />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(251,251,249,0.95)']}
            locations={[0, 0.5, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <BackHeader overlay />
          <View className="absolute top-[110px] left-5 px-2.5 py-1 bg-[rgba(251,251,249,0.92)]">
            <Text
              className="font-sans-bold text-[10px] tracking-[1.5px]"
              style={{ color: a.accent }}
            >
              {a.designation}
            </Text>
          </View>
        </View>

        {/* 제목 */}
        <View className="px-5 pb-4 -mt-5">
          <View className="flex-row gap-1.5 mb-2">
            <Tag color={a.accent} filled>
              {a.category}
            </Tag>
            <Tag color={TOKENS.inkSoft}>{a.period}</Tag>
          </View>
          <Text className="font-serif text-[30px] text-ink tracking-[-0.5px] leading-[35px]">
            {a.name}
          </Text>
          <Text className="font-sans text-[13px] text-inkSoft mt-3 leading-[21px]">
            {a.summary}
          </Text>
        </View>

        {/* 팩트 그리드 (2열) */}
        <View className="px-5 pb-6">
          <View className="bg-paper border border-line rounded-xl flex-row flex-wrap">
            {a.facts.map((f, i) => (
              <View
                key={i}
                className="p-4"
                style={{
                  width: '50%',
                  borderRightWidth: i % 2 === 0 ? 0.5 : 0,
                  borderRightColor: TOKENS.lineSoft,
                  borderBottomWidth: i < a.facts.length - 2 ? 0.5 : 0,
                  borderBottomColor: TOKENS.lineSoft,
                }}
              >
                <Text className="font-mono text-[9px] text-mute tracking-wider">
                  {f.label.toUpperCase()}
                </Text>
                <Text className="font-serif text-sm text-ink mt-1">{f.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 본문 */}
        <View className="px-5 pb-6">
          <Text className="font-serif text-base text-ink mb-2">이 유물의 이야기</Text>
          <Text className="font-serif-regular text-sm text-inkSoft leading-[26px] tracking-[-0.2px]">
            {a.story}
          </Text>
        </View>

        {/* 사진 */}
        <SectionLabel>사진 · PHOTOS</SectionLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          style={{ marginBottom: 24 }}
        >
          {[1, 2, 3].map((i) => (
            <PhotoPlaceholder key={i} height={140} width={200} />
          ))}
        </ScrollView>

        {/* 소재 장소 */}
        {place && (
          <>
            <SectionLabel>소재 장소 · LOCATION</SectionLabel>
            <View className="px-5 pb-6">
              <Pressable
                onPress={() => router.push(`/place/${place.id}` as never)}
                className="bg-paper border border-line rounded-xl flex-row overflow-hidden items-center"
              >
                <PhotoPlaceholder height={92} width={92} />
                <View className="flex-1 p-3.5">
                  <Tag color={place.accent}>{place.era}</Tag>
                  <Text className="font-serif text-[15px] text-ink mt-1">{place.name}</Text>
                  <Text className="font-sans text-[11px] text-mute mt-0.5">
                    {place.region} · {formatDistance(place.distance)}
                  </Text>
                </View>
                <View className="pr-3.5">
                  <ChevronRightIcon />
                </View>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
