import { View, Text, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { FONTS } from '../data/tokens';

type Props = {
  label?: string;
  height?: number;
  width?: number | string;
  style?: ViewStyle;
  /** accent 색상 배경. 주면 컬러 모드로 렌더. 없으면 회색 폴백 */
  tone?: string;
  /** 컬러 모드에서 가운데에 박을 한 글자 (보통 한국어 이름의 첫 글자) */
  glyph?: string;
};

export function PhotoPlaceholder({
  label = 'photo',
  height = 200,
  width = '100%',
  style,
  tone,
  glyph,
}: Props) {
  if (tone) {
    return (
      <View
        style={[
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            height: height as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            width: width as any,
            backgroundColor: tone,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {glyph ? (
          <Text
            style={{
              fontFamily: FONTS.serifBlack,
              fontSize: height * 0.5,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: -1,
              lineHeight: height * 0.55,
            }}
          >
            {glyph}
          </Text>
        ) : null}
      </View>
    );
  }

  // 폴백: 옅은 회색 + 대각선 + 모노 라벨
  return (
    <View
      style={[
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          height: height as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          width: width as any,
          backgroundColor: '#ECECEA',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(20,20,22,0.06)" strokeWidth="0.5" />
        <Line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(20,20,22,0.06)" strokeWidth="0.5" />
      </Svg>
      <Text className="font-mono text-[9px] tracking-wider text-[rgba(20,20,22,0.45)] px-2 py-0.5">
        {label}
      </Text>
    </View>
  );
}
