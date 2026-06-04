import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Place } from '../../types/places';
import { formatDistance } from '../../lib/geo';
import { Tag } from '../ui/Tag';
import { PhotoPlaceholder } from '../ui/PhotoPlaceholder';

export const PLACE_ROW_COMPACT_HEIGHT = 88;

type Props = {
  place: Place;
  stamped: boolean;
  onPress: (id: string) => void;
  /** 'detailed' (홈): summary 표시 / 'compact' (지도): 고정 높이 + 거리·지역 한 줄 */
  variant?: 'detailed' | 'compact';
};

export const PlaceRow = memo(function PlaceRow({
  place: p,
  stamped,
  onPress,
  variant = 'detailed',
}: Props) {
  const compact = variant === 'compact';

  return (
    <Pressable
      onPress={() => onPress(p.id)}
      className="flex-row gap-3 p-3 bg-paper border border-line rounded-xl items-center"
      style={compact ? { height: PLACE_ROW_COMPACT_HEIGHT } : undefined}
    >
      <PhotoPlaceholder height={64} width={64} photoUrl={p.photo?.url} />
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 mb-0.5">
          <Tag color={p.accent}>{p.era}</Tag>
          {stamped && <Text className="font-sans-bold text-[10px] text-red">● 스탬프 획득</Text>}
          <Text className="font-mono text-[10px] text-mute">{formatDistance(p.distance)}</Text>
        </View>
        <Text numberOfLines={compact ? 1 : undefined} className="font-serif text-[15px] text-ink">
          {p.name}
        </Text>
        <Text
          numberOfLines={1}
          className={
            compact
              ? 'font-mono text-[10px] text-mute mt-0.5'
              : 'font-sans text-[11px] text-mute mt-0.5'
          }
        >
          {compact ? `${formatDistance(p.distance)} · ${p.region}` : p.summary}
        </Text>
      </View>
    </Pressable>
  );
});
