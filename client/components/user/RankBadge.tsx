import { View, Text } from 'react-native';
import { Level } from '../../types/user';

type Props = {
  level: Level;
  size?: 'sm' | 'md' | 'lg';
};

export function RankBadge({ level, size = 'sm' }: Props) {
  const dims =
    size === 'lg'
      ? { padV: 6, padH: 12, fs: 13 }
      : size === 'md'
        ? { padV: 4, padH: 10, fs: 11 }
        : { padV: 3, padH: 8, fs: 10 };

  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full self-start"
      style={{
        paddingVertical: dims.padV,
        paddingHorizontal: dims.padH,
        backgroundColor: level.color,
      }}
    >
      <Text className="font-sans-bold text-paper tracking-[0.3px]" style={{ fontSize: dims.fs }}>
        Lv{level.level} · {level.name}
      </Text>
    </View>
  );
}
