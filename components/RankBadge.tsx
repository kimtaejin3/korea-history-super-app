import { View, Text } from 'react-native';
import { FONTS, TOKENS } from '../data/tokens';
import { Level } from '../data/user';

type Props = {
  level: Level;
  size?: 'sm' | 'md' | 'lg';
};

export function RankBadge({ level, size = 'sm' }: Props) {
  const dims =
    size === 'lg'
      ? { padV: 6, padH: 12, fs: 13, glyph: 16 }
      : size === 'md'
        ? { padV: 4, padH: 10, fs: 11, glyph: 14 }
        : { padV: 3, padH: 8, fs: 10, glyph: 12 };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: dims.padV,
        paddingHorizontal: dims.padH,
        backgroundColor: level.color,
        borderRadius: 99,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.sansBold,
          fontSize: dims.fs,
          color: TOKENS.paper,
          letterSpacing: 0.3,
        }}
      >
        Lv{level.level} · {level.name}
      </Text>
    </View>
  );
}
