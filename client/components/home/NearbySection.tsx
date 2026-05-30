import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useUserCoords } from '../../stores/userLocation';
import { nearbyQueryOptions } from '../../queries/places';
import { stampedQueryOptions } from '../../queries/stamps';
import { formatDistance } from '../../lib/geo';
import { SectionLabel } from '../SectionLabel';
import { Tag } from '../Tag';
import { Stamp } from '../Stamp';
import { PhotoPlaceholder } from '../PhotoPlaceholder';

export function NearbySection() {
  const router = useRouter();
  const coords = useUserCoords();
  // nearby + stamped를 한 useSuspenseQueries로 묶어 병렬 발사 (waterfall 방지).
  // nearby는 HeroSection도 호출 — 같은 queryKey라 React Query가 dedupe.
  const [{ data: nearby }, { data: stamped }] = useSuspenseQueries({
    queries: [
      nearbyQueryOptions({ lat: coords.lat, lon: coords.lon, radius: 20, limit: 30 }),
      stampedQueryOptions(),
    ],
  });

  return (
    <>
      <SectionLabel
        action={
          <Pressable onPress={() => router.push('/(tabs)/map' as never)}>
            <Text className="font-sans-bold text-[11px] text-red">지도에서 보기 →</Text>
          </Pressable>
        }
      >
        내 주변 · NEARBY
      </SectionLabel>
      <View className="px-5 pb-6 gap-2.5">
        {nearby.items.slice(1, 4).map((p) => (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/place/${p.id}` as never)}
            className="flex-row gap-3 p-3 bg-paper border border-line rounded-xl items-center"
          >
            <PhotoPlaceholder height={64} width={64} photoUrl={p.photo?.url} />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <Tag color={p.accent}>{p.era}</Tag>
                <Text className="font-mono text-[10px] text-mute">
                  {formatDistance(p.distance)}
                </Text>
              </View>
              <Text className="font-serif text-[15px] text-ink">{p.name}</Text>
              <Text numberOfLines={1} className="font-sans text-[11px] text-mute mt-0.5">
                {p.summary}
              </Text>
            </View>
            {stamped.includes(p.id) && (
              <Stamp glyph={p.nameHanja[0]} size={36} rotate={-8} color={p.accent} />
            )}
          </Pressable>
        ))}
      </View>
    </>
  );
}
