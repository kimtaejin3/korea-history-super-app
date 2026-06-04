import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { useUserCoords } from '../../stores/userLocation';
import { nearbyQueryOptions } from '../../queries/places';
import { stampedQueryOptions } from '../../queries/stamps';
import { SectionLabel } from '../ui/SectionLabel';
import { PlaceRow } from '../place/PlaceRow';

export function NearbySection() {
  const router = useRouter();
  const coords = useUserCoords();

  const [{ data: nearby }, { data: stamped }] = useSuspenseQueries({
    queries: [
      nearbyQueryOptions({ lat: coords.lat, lon: coords.lon, radius: 20, limit: 30 }),
      stampedQueryOptions(),
    ],
  });

  const stampedSet = useMemo(() => new Set(stamped ?? []), [stamped]);
  const onPress = useCallback((id: string) => router.push(`/place/${id}` as never), [router]);

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
        {nearby.items.slice(0, 4).map((p) => (
          <PlaceRow key={p.id} place={p} stamped={stampedSet.has(p.id)} onPress={onPress} />
        ))}
      </View>
    </>
  );
}
