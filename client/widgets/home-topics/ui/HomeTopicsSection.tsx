import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { topicsQueryOptions } from '@entities/topic/api/queries';

const CARD_WIDTH = 240;
const CARD_HEIGHT = 176;

export function HomeTopicsSection() {
  const router = useRouter();
  const { data: topics } = useSuspenseQuery(topicsQueryOptions());

  if (topics.length === 0) return null;

  return (
    <View className="pb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, gap: 12 }}
      >
        {topics.map((topic) => (
          <Pressable
            key={topic.id}
            onPress={() => router.push(`/topic/${topic.id}` as never)}
            className="rounded-xl overflow-hidden"
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT, backgroundColor: topic.accent }}
          >
            <View className="p-5 flex-1 justify-between">
              <View className="flex-row items-start justify-between">
                <Text className="font-serif text-[40px] text-paper leading-[44px]">
                  {topic.glyph}
                </Text>
                {topic.era && (
                  <View className="bg-white/20 px-2 py-1 rounded">
                    <Text className="font-sans-bold text-[10px] text-paper tracking-[0.5px]">
                      {topic.era}
                    </Text>
                  </View>
                )}
              </View>
              <View>
                <Text
                  className="font-serif text-[16px] text-paper tracking-[-0.2px] leading-5"
                  numberOfLines={2}
                >
                  {topic.name}
                </Text>
                <Text
                  className="font-sans text-[11px] text-paper/75 mt-1"
                  numberOfLines={2}
                >
                  {topic.description}
                </Text>
                <Text className="font-mono text-[10px] text-paper/60 mt-2">
                  {topic.placeIds.length}곳
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function HomeTopicsSkeleton() {
  return (
    <View className="pb-6">
      <View className="flex-row gap-3 px-5">
        <View
          className="bg-paperWarm rounded-xl"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
        <View
          className="bg-paperWarm rounded-xl"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        />
      </View>
    </View>
  );
}
