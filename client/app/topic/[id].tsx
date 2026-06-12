import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { topicQueryOptions } from '@entities/topic/api/queries';
import { placesQueryOptions } from '@entities/place/api/queries';
import { stampedQueryOptions } from '@entities/stamp/api/queries';
import { BackHeader } from '@shared/ui/BackHeader';
import { SectionBoundary } from '@shared/ui/SectionBoundary';
import { PlaceRow } from '@entities/place/ui/PlaceRow';
import type { Place } from '@entities/place/model/types';

const NotFound = () => (
  <View className="flex-1 bg-paper">
    <BackHeader title="주제를 찾을 수 없어요" />
  </View>
);

const Loading = () => (
  <View className="flex-1 bg-paper">
    <BackHeader />
  </View>
);

export default function TopicDetailScreen() {
  return (
    <SectionBoundary fallback={<Loading />} errorFallback={<NotFound />}>
      <TopicContent />
    </SectionBoundary>
  );
}

function TopicContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [{ data: topic }, { data: places }, { data: stamped }] = useSuspenseQueries({
    queries: [topicQueryOptions(id), placesQueryOptions(), stampedQueryOptions()],
  });

  const stampedSet = new Set(stamped);
  const byId = new Map(places.map((p) => [p.id, p]));
  const items = topic.placeIds
    .map((pid) => byId.get(pid))
    .filter((p): p is Place => Boolean(p));

  const handlePress = (placeId: string) => {
    router.push(`/place/${placeId}` as never);
  };

  return (
    <View className="flex-1 bg-paper">
      <BackHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View
          className="mx-5 mt-2 mb-6 rounded-xl overflow-hidden"
          style={{ backgroundColor: topic.accent }}
        >
          <View className="p-6">
            <View className="flex-row items-start justify-between mb-4">
              <Text className="font-serif text-[48px] text-paper leading-[52px]">
                {topic.glyph}
              </Text>
              {topic.era && (
                <View className="bg-white/20 px-2.5 py-1 rounded">
                  <Text className="font-sans-bold text-[11px] text-paper tracking-[0.5px]">
                    {topic.era}
                  </Text>
                </View>
              )}
            </View>
            <Text className="font-serif text-[22px] text-paper tracking-[-0.3px] leading-7">
              {topic.name}
            </Text>
            <Text className="font-sans text-[12px] text-paper/80 mt-2 leading-5">
              {topic.description}
            </Text>
            <Text className="font-mono-bold text-[11px] text-paper/60 mt-3">
              {items.length}곳
            </Text>
          </View>
        </View>

        <View className="px-5 gap-3">
          {items.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              stamped={stampedSet.has(place.id)}
              onPress={handlePress}
              variant="detailed"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
