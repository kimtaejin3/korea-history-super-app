import { useEffect } from 'react';
import {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type Rect = { x: number; y: number; width: number; height: number };

export type MorphConfig = {
  /** true가 되는 순간 source 위치로 점프 후 morph 시작. false면 즉시 숨김 (opacity=0, 트리엔 남음). */
  active: boolean;
  /** 시작 사각형. */
  source: Rect | null | undefined;
  /** Phase 1 끝 / Phase 2 시작. null이면 source → target 단일 phase. */
  midpoint?: Rect | null;
  /** 최종 사각형. */
  target: Rect | null | undefined;
  /** 각 phase의 ms. 기본 200. midpoint 없으면 (phaseDuration*2 + pauseDuration)로 합쳐 단일 timing. */
  phaseDuration?: number;
  /** Phase 1과 Phase 2 사이 일시정지(ms). 기본 0 = 연속. */
  pauseDuration?: number;
  /** Phase 2 끝에 호출 (JS 스레드). */
  onComplete?: () => void;
};

export type MorphReturn = {
  /** 컨테이너 Animated.View에 바로 적용할 left/top/width/height/borderRadius/opacity. */
  containerStyle: ReturnType<typeof useAnimatedStyle>;
  /** derived animated style용 — 너비 기반 interpolation 등. */
  width: SharedValue<number>;
  /** derived animated style용 — 높이 기반 위치 등. */
  height: SharedValue<number>;
  /** 0 → 0.5(Phase 1 끝) → 1(Phase 2 끝). 텍스트 fade-in 같은 곳에. */
  progress: SharedValue<number>;
};

/**
 * 사각형 morph 훅. source → (midpoint) → target을 두 phase로 보간.
 *
 * 사용처: SearchTransitionOverlay (홈 검색 버튼 → 지도 검색바).
 *
 * 트리거: `active` 전이만 본다. 호출자는 source/midpoint/target을 active와 같은 사이클에
 * 함께 갱신해야 한다 (현 흐름과 동일).
 */
export function useMorph({
  active,
  source,
  midpoint,
  target,
  phaseDuration = 200,
  pauseDuration = 0,
  onComplete,
}: MorphConfig): MorphReturn {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const radius = useSharedValue(0);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active || !source || !target) {
      opacity.value = 0;
      return;
    }

    x.value = source.x;
    y.value = source.y;
    width.value = source.width;
    height.value = source.height;
    radius.value = source.width / 2;
    progress.value = 0;
    opacity.value = 1;

    if (midpoint) {
      const twoPhase = (toMid: number, toTarget: number) =>
        withSequence(
          withTiming(toMid, { duration: phaseDuration }),
          withDelay(pauseDuration, withTiming(toTarget, { duration: phaseDuration }))
        );

      x.value = twoPhase(midpoint.x, target.x);
      y.value = twoPhase(midpoint.y, target.y);
      width.value = twoPhase(midpoint.width, target.width);
      height.value = twoPhase(midpoint.height, target.height);
      radius.value = twoPhase(midpoint.height / 2, target.height / 2);

      progress.value = withSequence(
        withTiming(0.5, { duration: phaseDuration }),
        withDelay(
          pauseDuration,
          withTiming(1, { duration: phaseDuration }, (finished) => {
            if (finished && onComplete) runOnJS(onComplete)();
          })
        )
      );
    } else {
      const total = phaseDuration * 2 + pauseDuration;
      x.value = withTiming(target.x, { duration: total });
      y.value = withTiming(target.y, { duration: total });
      width.value = withTiming(target.width, { duration: total });
      height.value = withTiming(target.height, { duration: total });
      radius.value = withTiming(target.height / 2, { duration: total });
      progress.value = withTiming(1, { duration: total }, (finished) => {
        if (finished && onComplete) runOnJS(onComplete)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const containerStyle = useAnimatedStyle(() => ({
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
    borderRadius: radius.value,
    opacity: opacity.value,
  }));

  return { containerStyle, width, height, progress };
}
