import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUserLocation } from '../../lib/useUserLocation';
import { nearbyQueryOptions } from '../../queries/places';
import { TOKENS } from '../../lib/tokens';
import { formatDistance } from '../../lib/geo';
import { Tag } from '../Tag';
import { PhotoPlaceholder } from '../PhotoPlaceholder';
import { PhotoCredit } from '../PhotoCredit';

export function HeroSection() {
  const router = useRouter();
  const { coords } = useUserLocation();
  const { data: nearby } = useSuspenseQuery(
    nearbyQueryOptions({ lat: coords.lat, lon: coords.lon, radius: 20, limit: 30 })
  );
  const hero = nearby.items[0];
  if (!hero) return null;

  return (
    <View className="px-5 pb-6">
      <Pressable
        onPress={() => router.push(`/place/${hero.id}` as never)}
        className="bg-paper border border-line rounded-xl overflow-hidden"
      >
        <View>
          <PhotoPlaceholder height={170} photoUrl={hero.photo?.url} />
          {hero.photo && (
            <PhotoCredit
              photo={hero.photo}
              style={{ position: 'absolute', bottom: 6, right: 8 }}
            />
          )}
        </View>
        <View className="p-4">
          <View className="flex-row items-center gap-1.5 mb-1.5">
            <Tag color={hero.accent} filled>
              {hero.tag}
            </Tag>
            <Tag color={TOKENS.mute}>{hero.era}</Tag>
            <View className="flex-1" />
            <Text className="font-mono-bold text-[11px] text-red">
              {formatDistance(hero.distance)}
            </Text>
          </View>
          <Text className="font-serif text-xl text-ink tracking-[-0.3px] leading-6">
            {hero.name}
          </Text>
          <Text className="font-serif-regular text-[11px] text-mute mt-0.5 tracking-[1.5px]">
            {hero.region}
          </Text>
          <Text className="font-sans text-[13px] text-inkSoft mt-2.5 leading-5">
            {hero.summary}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
