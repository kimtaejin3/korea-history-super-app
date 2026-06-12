// noinspection JSUnusedGlobalSymbols

import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TOKENS } from '@shared/lib/tokens';
import { SearchIcon } from '@shared/ui/icons';
import { useSearchState } from '@features/search-transition/model/store';
import {
  SEARCH_BAR_HEIGHT,
  SEARCH_BAR_ICON_GAP,
  SEARCH_BAR_ICON_SIZE,
  SEARCH_BAR_INNER_PX,
  SEARCH_BAR_PADDING_TOP,
  SEARCH_BAR_PADDING_X,
} from '@features/search-transition/lib/searchBarLayout';
import { NearbySheet } from '@widgets/nearby-sheet/ui/NearbySheet';

const FILTERS = ['전체', '조선', '백제', '통일신라', '근현대'];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('전체');
  const searchTransition = useSearchState();
  const showBar = !searchTransition.active;

  return (
    <View className="flex-1 bg-[#E8E1D2]">
      <View
        className="pb-3"
        style={{
          paddingTop: insets.top + SEARCH_BAR_PADDING_TOP,
          paddingHorizontal: SEARCH_BAR_PADDING_X,
        }}
      >
        <LinearGradient
          colors={['rgba(232,225,210,0.95)', 'rgba(232,225,210,0)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: insets.top + 120,
          }}
          pointerEvents="none"
        />
        <View style={{ height: SEARCH_BAR_HEIGHT }}>
          <View
            className="absolute left-0 right-0 top-0 flex-row items-center bg-paper rounded-full"
            style={{
              height: SEARCH_BAR_HEIGHT,
              paddingHorizontal: SEARCH_BAR_INNER_PX,
              gap: SEARCH_BAR_ICON_GAP,
              opacity: showBar ? 1 : 0,
            }}
            pointerEvents={showBar ? 'auto' : 'none'}
          >
            <SearchIcon size={SEARCH_BAR_ICON_SIZE} color={TOKENS.mute} strokeWidth={1.8} />
            <Text className="flex-1 font-sans text-[13px] text-mute">장소 · 테마 · 시대 검색</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, marginTop: 10 }}
        >
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full ${on ? 'bg-ink' : 'bg-paper'}`}
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className={`font-sans-bold text-xs ${on ? 'text-paper' : 'text-inkSoft'}`}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <NearbySheet filter={filter} insets={insets} />
    </View>
  );
}
