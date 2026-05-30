// noinspection JSUnusedGlobalSymbols

import { useRef } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { haptic } from '../../lib/haptics';
import { PinIcon, SearchIcon } from '../../components/icons';
import { useSearchActions } from '../../stores/searchTransition';
import { getSearchBarRect } from '../../lib/searchBarLayout';
import { SectionBoundary } from '../../components/SectionBoundary';
import { HeroSection } from '../../components/home/HeroSection';
import { NearbySection } from '../../components/home/NearbySection';
import { ActiveThemesSection } from '../../components/home/ActiveThemesSection';
import { MyJourneySection } from '../../components/home/MyJourneySection';
import {
  HeroSkeleton,
  NearbySkeleton,
  ActiveThemesSkeleton,
  MyJourneySkeleton,
} from '../../components/home/skeletons';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const searchBtnRef = useRef<View>(null);
  const { width: screenWidth } = useWindowDimensions();
  const { start: startSearchTransition } = useSearchActions();

  const onPressSearch = () => {
    haptic.tap();
    const node = searchBtnRef.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      const target = getSearchBarRect(insets.top, screenWidth);
      startSearchTransition({ x, y, width, height }, target);
      setTimeout(() => {
        router.push('/(tabs)/map' as never);
      }, 200);
    });
  };

  return (
    <View className="flex-1 bg-paper">
      {/* 고정 헤더 (정적) */}
      <View
        className="px-5 pb-2 flex-row justify-between items-center bg-paper z-10"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-1.5">
          <PinIcon />
          <Text className="font-sans-bold text-[13px] text-ink">충남 아산시 배방읍</Text>
        </View>
        <Pressable
          ref={searchBtnRef}
          accessibilityLabel="search"
          onPress={onPressSearch}
          className="w-9 h-9 rounded-full bg-[rgba(26,22,20,0.05)] items-center justify-center"
        >
          <SearchIcon />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 큰 인사말 (정적) */}
        <View className="px-5 pt-1 pb-4">
          <Text className="font-serif text-[26px] text-ink tracking-[-0.5px] leading-8">
            오늘, 가까운 곳에서{'\n'}
            <Text className="text-red">역사 한 조각</Text>을 만나보세요
          </Text>
        </View>

        <SectionBoundary fallback={<HeroSkeleton />}>
          <HeroSection />
        </SectionBoundary>

        <SectionBoundary fallback={<NearbySkeleton />}>
          <NearbySection />
        </SectionBoundary>

        <SectionBoundary fallback={<ActiveThemesSkeleton />}>
          <ActiveThemesSection />
        </SectionBoundary>

        <SectionBoundary fallback={<MyJourneySkeleton />}>
          <MyJourneySection />
        </SectionBoundary>
      </ScrollView>
    </View>
  );
}
