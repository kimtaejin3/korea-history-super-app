import { Linking, Pressable, Text, View, type ViewStyle } from 'react-native';
import type { Photo } from '../data/places';

type Props = {
  photo: Photo;
  /** 어두운 배경(hero) 위에 올릴 때 'dark', 밝은 배경엔 'light'. 기본 dark. */
  variant?: 'dark' | 'light';
  style?: ViewStyle;
};

const LICENSE_LABEL: Record<Photo['license'], string> = {
  'cc-by-sa': 'CC BY-SA',
  'public-domain': 'Public Domain',
  'kogl-1': '공공누리 1유형',
  'kogl-2': '공공누리 2유형',
  'kogl-3': '공공누리 3유형',
  'kogl-4': '공공누리 4유형',
  unknown: '출처표기',
};

export function PhotoCredit({ photo, variant = 'dark', style }: Props) {
  const isDark = variant === 'dark';
  const bg = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)';
  const fg = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(20,20,22,0.7)';

  const onPress = () => {
    if (photo.sourceUrl) Linking.openURL(photo.sourceUrl).catch(() => {});
  };

  const inner = (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
      }}
    >
      <Text
        style={{
          color: fg,
          fontSize: 10,
          fontFamily: 'Pretendard-Regular',
        }}
        numberOfLines={1}
      >
        © {photo.credit} · {LICENSE_LABEL[photo.license]}
      </Text>
    </View>
  );

  if (photo.sourceUrl) {
    return (
      <Pressable onPress={onPress} style={style}>
        {inner}
      </Pressable>
    );
  }
  return <View style={style}>{inner}</View>;
}
