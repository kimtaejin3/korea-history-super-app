import { useEffect } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSearchActions, useSearchState } from '../../stores/searchTransition';
import { FONTS, TOKENS } from '../../lib/tokens';
import {
  HOME_SEARCH_BTN_SIZE,
  SEARCH_BAR_ICON_SIZE,
  SEARCH_BAR_INNER_PX,
  SEARCH_BAR_TEXT_LEFT,
} from '../../lib/searchBarLayout';
import { SearchIcon } from '../ui/icons';

const PHASE_DURATION = 200;
const PAUSE_DURATION = 0;
const MID_WIDTH = 240;

export function SearchTransitionOverlay() {
  const state = useSearchState();
  const { end } = useSearchActions();
  const { width: screenWidth } = useWindowDimensions();

  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const width = useSharedValue(36);
  const height = useSharedValue(36);
  const radius = useSharedValue(18);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!state.active || !state.source || !state.target) {
      opacity.value = 0;
      return;
    }
    const target = state.target;

    const mid = {
      x: (screenWidth - MID_WIDTH) / 2,
      y: target.y,
      width: MID_WIDTH,
      height: target.height,
    };

    x.value = state.source.x;
    y.value = state.source.y;
    width.value = state.source.width;
    height.value = state.source.height;
    radius.value = state.source.width / 2;
    progress.value = 0;
    opacity.value = 1;

    const twoPhase = (toMid: number, toTarget: number) =>
      withSequence(
        withTiming(toMid, { duration: PHASE_DURATION }),
        withDelay(PAUSE_DURATION, withTiming(toTarget, { duration: PHASE_DURATION }))
      );

    x.value = twoPhase(mid.x, target.x);
    y.value = twoPhase(mid.y, target.y);
    width.value = twoPhase(mid.width, target.width);
    height.value = twoPhase(mid.height, target.height);
    radius.value = twoPhase(mid.height / 2, target.height / 2);

    progress.value = withSequence(
      withTiming(0.5, { duration: PHASE_DURATION }),
      withDelay(
        PAUSE_DURATION,
        withTiming(1, { duration: PHASE_DURATION }, (finished) => {
          if (finished) runOnJS(end)();
        })
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active]);

  const containerStyle = useAnimatedStyle(() => ({
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
    borderRadius: radius.value,
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    left: interpolate(
      width.value,
      [HOME_SEARCH_BTN_SIZE, HOME_SEARCH_BTN_SIZE * 5],
      [(HOME_SEARCH_BTN_SIZE - SEARCH_BAR_ICON_SIZE) / 2, SEARCH_BAR_INNER_PX],
      Extrapolate.CLAMP
    ),
    top: (height.value - SEARCH_BAR_ICON_SIZE) / 2,
  }));

  const placeholderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolate.CLAMP),
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      <Animated.View style={[styles.icon, iconStyle]}>
        <SearchIcon size={SEARCH_BAR_ICON_SIZE} color={TOKENS.mute} strokeWidth={1.8} />
      </Animated.View>
      <Animated.View style={[styles.placeholder, placeholderStyle]}>
        <Text style={styles.placeholderText}>장소 · 테마 · 시대 검색</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: TOKENS.paper,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1000,
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
  },
  placeholder: {
    position: 'absolute',
    left: SEARCH_BAR_TEXT_LEFT,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: TOKENS.mute,
  },
});
