// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinIcon } from '../../components/ui/icons';
import { SearchButton } from '../../components/search/SearchButton';
import { SectionBoundary } from '../../components/ui/SectionBoundary';
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

  return (
    <View className="flex-1 bg-paper">
      <View
        className="px-5 pb-2 flex-row justify-between items-center bg-paper z-10"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-1.5">
          <PinIcon />
          <Text className="font-sans-bold text-[13px] text-ink">충남 아산시 배방읍</Text>
        </View>
        <SearchButton />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
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
