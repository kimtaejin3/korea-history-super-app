import { useEffect } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native';
import { useSearchActions, useSearchState } from '../../stores/searchTransition';
import { FONTS, TOKENS } from '../../lib/tokens';
import {
  HOME_SEARCH_BTN_SIZE,
  SEARCH_BAR_ICON_SIZE,
  SEARCH_BAR_INNER_PX,
  SEARCH_BAR_TEXT_LEFT,
} from '../../lib/searchBarLayout';
import { SearchIcon } from '../ui/icons';

const DURATION = 400;

export function SearchTransitionOverlay() {
  const state = useSearchState();
  const { end } = useSearchActions();

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const width = useSharedValue(36);
  const height = useSharedValue(36);
  const radius = useSharedValue(18);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (state.active && state.source && state.target) {
      // 시작 좌표로 즉시 점프
      x.value = state.source.x;
      y.value = state.source.y;
      width.value = state.source.width;
      height.value = state.source.height;
      radius.value = state.source.width / 2;
      progress.value = 0;
      opacity.value = 1;

      // 목표 좌표로 보간
      x.value = withTiming(state.target.x, { duration: DURATION });
      y.value = withTiming(state.target.y, { duration: DURATION });
      width.value = withTiming(state.target.width, { duration: DURATION });
      height.value = withTiming(state.target.height, { duration: DURATION });
      radius.value = withTiming(state.target.height / 2, { duration: DURATION });
      progress.value = withTiming(1, { duration: DURATION }, (finished) => {
        if (finished) {
          // morph 완료와 동시에 종료. 페이드아웃 없음. 같은 위치의 real bar로 자연스럽게 인계.
          runOnJS(end)();
        }
      });
    }
    // active가 false면 아무것도 안 함 (다음 start() 호출이 다시 리셋함)
  }, [
    state.active,
    state.source,
    state.target,
    x,
    y,
    width,
    height,
    radius,
    progress,
    opacity,
    end,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
    borderRadius: radius.value,
    backgroundColor: TOKENS.paper,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 4,
    opacity: opacity.value,
    zIndex: 1000,
    overflow: 'hidden',
  }));

  // 아이콘 위치: 작을 때(홈 버튼 크기) 중앙, 클 때 바 내부 좌측 패딩 위치
  const iconStyle = useAnimatedStyle(() => {
    const iconLeft = interpolate(
      width.value,
      [HOME_SEARCH_BTN_SIZE, HOME_SEARCH_BTN_SIZE * 5],
      [(HOME_SEARCH_BTN_SIZE - SEARCH_BAR_ICON_SIZE) / 2, SEARCH_BAR_INNER_PX],
      Extrapolate.CLAMP
    );
    return {
      position: 'absolute',
      left: iconLeft,
      top: (height.value - SEARCH_BAR_ICON_SIZE) / 2,
    };
  });

  const placeholderStyle = useAnimatedStyle(() => {
    // 너비가 충분히 커지기 전까지는 안 보이게
    const op = interpolate(progress.value, [0.5, 1], [0, 1], Extrapolate.CLAMP);
    return {
      position: 'absolute',
      left: SEARCH_BAR_TEXT_LEFT,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      opacity: op,
    };
  });

  if (!state.active) return null;

  return (
    <Animated.View style={containerStyle} pointerEvents="none">
      <Animated.View style={iconStyle}>
        <SearchIcon size={SEARCH_BAR_ICON_SIZE} color={TOKENS.mute} strokeWidth={1.8} />
      </Animated.View>
      <Animated.View style={placeholderStyle}>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 13, color: TOKENS.mute }}>
          장소 · 테마 · 시대 검색
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
