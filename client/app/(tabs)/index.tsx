// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinIcon } from '@shared/ui/icons';
import { SearchButton } from '@features/search-transition/ui/SearchButton';
import { SectionBoundary } from '@shared/ui/SectionBoundary';
import { NearbySection } from '@widgets/home-nearby/ui/NearbySection';
import { ActiveThemesSection } from '@widgets/home-themes/ui/ActiveThemesSection';
import { MyJourneySection } from '@widgets/home-journey/ui/MyJourneySection';
import { HomeHeadline } from '@widgets/home-headline/ui/HomeHeadline';
import {
  HomeTopicsSection,
  HomeTopicsSkeleton,
} from '@widgets/home-topics/ui/HomeTopicsSection';
import {
  NearbySkeleton,
  ActiveThemesSkeleton,
  MyJourneySkeleton,
} from '@widgets/home-nearby/ui/skeletons';

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
        <HomeHeadline />

        <SectionBoundary fallback={<HomeTopicsSkeleton />}>
          <HomeTopicsSection />
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
