import { useRef } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { haptic } from '@shared/lib/haptics';
import { getSearchBarRect } from '@features/search-transition/lib/searchBarLayout';
import { useSearchActions, useSearchState } from '@features/search-transition/model/store';
import { SearchIcon } from '@shared/ui/icons';

const NAV_DELAY_MS = 200;

export function SearchButton() {
  const ref = useRef<View>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { start } = useSearchActions();
  const morphing = useSearchState().active;

  const onPress = () => {
    haptic.tap();
    const node = ref.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      const target = getSearchBarRect(insets.top, screenWidth);
      start({ x, y, width, height }, target);
      setTimeout(() => {
        router.push('/(tabs)/map' as never);
      }, NAV_DELAY_MS);
    });
  };

  return (
    <Pressable
      ref={ref}
      accessibilityLabel="search"
      onPress={onPress}
      className="w-9 h-9 rounded-full bg-[rgba(26,22,20,0.05)] items-center justify-center"
      style={{ opacity: morphing ? 0 : 1 }}
      pointerEvents={morphing ? 'none' : 'auto'}
    >
      <SearchIcon />
    </Pressable>
  );
}
