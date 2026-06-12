import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSearchActions, useSearchState } from '@features/search-transition/model/store';
import { FONTS, TOKENS } from '@shared/lib/tokens';
import {
  HOME_SEARCH_BTN_SIZE,
  SEARCH_BAR_ICON_SIZE,
  SEARCH_BAR_INNER_PX,
  SEARCH_BAR_TEXT_LEFT,
} from '@features/search-transition/lib/searchBarLayout';
import { useMorph } from '@features/search-transition/lib/useMorph';
import { SearchIcon } from '@shared/ui/icons';

const PHASE_DURATION = 200;
const PAUSE_DURATION = 0;
const MID_WIDTH = 240;

export function SearchTransitionOverlay() {
  const state = useSearchState();
  const { end } = useSearchActions();
  const { width: screenWidth } = useWindowDimensions();

  const midpoint = state.target
    ? {
        x: (screenWidth - MID_WIDTH) / 2,
        y: state.target.y,
        width: MID_WIDTH,
        height: state.target.height,
      }
    : null;

  const { containerStyle, width, height, progress } = useMorph({
    active: state.active,
    source: state.source,
    midpoint,
    target: state.target,
    phaseDuration: PHASE_DURATION,
    pauseDuration: PAUSE_DURATION,
    onComplete: end,
  });

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
