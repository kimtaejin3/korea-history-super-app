import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

type Props = {
  source: number;
  size: number;
  loop?: boolean;
  speed?: number;
  autoPlay?: boolean;
  /** 지정하면 0~endFrame까지만 재생하고 멈춤. autoPlay는 자동으로 false 취급. */
  endFrame?: number;
};

export function LottieAsset({
  source,
  size,
  loop = true,
  speed = 1,
  autoPlay = true,
  endFrame,
}: Props) {
  const ref = useRef<LottieView>(null);

  useEffect(() => {
    if (endFrame !== undefined) {
      ref.current?.play(0, endFrame);
    }
  }, [endFrame]);

  return (
    <View style={{ width: size, height: size }} pointerEvents="none">
      <LottieView
        ref={ref}
        autoPlay={endFrame === undefined ? autoPlay : false}
        loop={loop}
        speed={speed}
        // require()는 number를 반환하지만 LottieView가 런타임에 처리. 타입만 우회.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        source={source as any}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
