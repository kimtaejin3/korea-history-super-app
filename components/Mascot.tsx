import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { TOKENS } from '../data/tokens';

type Props = {
  size?: number;
  /** require()로 받은 .riv 파일 모듈. 없으면 SVG 폴백. */
  source?: number;
  /** Rive 상태머신 이름 */
  stateMachine?: string;
  /** Rive artboard 이름 */
  artboard?: string;
};

export function Mascot({ size = 120, source, stateMachine, artboard }: Props) {
  if (source) {
    // Rive 파일이 지정됐을 때만 동적 require — Expo Go에서는 이 코드 자체에 닿지 않게.
    const RiveAnimation = require('./MascotRive').MascotRive;
    return (
      <RiveAnimation
        size={size}
        source={source}
        stateMachineName={stateMachine}
        artboardName={artboard}
      />
    );
  }
  return <SvgFallback size={size} />;
}

/**
 * 임시 SVG 삽살개 — Rive 파일 들어오기 전까지 사용.
 */
function SvgFallback({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Ellipse cx="60" cy="105" rx="34" ry="14" fill="#E8DFCF" />
        <Circle cx="60" cy="60" r="42" fill="#F4ECD8" />
        <Ellipse cx="22" cy="48" rx="11" ry="22" fill="#C2A877" transform="rotate(-20 22 48)" />
        <Ellipse cx="98" cy="48" rx="11" ry="22" fill="#C2A877" transform="rotate(20 98 48)" />
        <Ellipse cx="44" cy="50" rx="14" ry="7" fill="#9B7E4A" />
        <Ellipse cx="76" cy="50" rx="14" ry="7" fill="#9B7E4A" />
        <Circle cx="44" cy="56" r="3" fill={TOKENS.ink} />
        <Circle cx="76" cy="56" r="3" fill={TOKENS.ink} />
        <Circle cx="45" cy="55" r="1" fill={TOKENS.paper} />
        <Circle cx="77" cy="55" r="1" fill={TOKENS.paper} />
        <Ellipse cx="60" cy="70" rx="5" ry="4" fill={TOKENS.ink} />
        <Path
          d="M 60 73 Q 60 80 53 82"
          stroke={TOKENS.ink}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 60 73 Q 60 80 67 82"
          stroke={TOKENS.ink}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <Ellipse cx="60" cy="85" rx="5" ry="3" fill={TOKENS.red} />
      </Svg>
    </View>
  );
}
