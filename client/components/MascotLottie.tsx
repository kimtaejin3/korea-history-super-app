import { View } from 'react-native';
import LottieView from 'lottie-react-native';

type Props = {
  size: number;
  /** require()로 받은 .json 파일 모듈 */
  source: number;
  loop?: boolean;
  speed?: number;
};

export function MascotLottie({ size, source, loop = true, speed = 1 }: Props) {
  return (
    <View style={{ width: size, height: size }}>
      <LottieView
        autoPlay
        loop={loop}
        speed={speed}
        // require()는 number를 반환하지만 LottieView는 런타임에 처리. 타입만 우회.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        source={source as any}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
