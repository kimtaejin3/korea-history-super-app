// noinspection JSUnusedGlobalSymbols

import { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { Tag } from '../../components/Tag';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { SearchIcon } from '../../components/icons';
import { useSearchTransition } from '../../context/SearchTransition';
import {
  SEARCH_BAR_HEIGHT,
  SEARCH_BAR_ICON_GAP,
  SEARCH_BAR_ICON_SIZE,
  SEARCH_BAR_INNER_PX,
  SEARCH_BAR_PADDING_TOP,
  SEARCH_BAR_PADDING_X,
} from '../../lib/searchBarLayout';

const FILTERS = ['전체', '조선', '백제', '통일신라', '근현대'];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState('전체');

  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const { state: searchTransition } = useSearchTransition();

  const showBar = !searchTransition.active;

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '55%', '90%'], []);

  if (!placesQuery.data || !stampedQuery.data) {
    return <View className="flex-1 bg-[#E8E1D2]" />;
  }
  const PLACES = placesQuery.data;
  const STAMPED = stampedQuery.data;
  const visible = PLACES.filter((p) => filter === '전체' || p.era === filter);
  const nearby = [...visible].sort((a, b) => a.distance - b.distance);

  return (
    <View className="flex-1 bg-[#E8E1D2]">
      {/* 상단 검색 + 필터 */}
      <View
        className="pb-3"
        style={{
          paddingTop: insets.top + SEARCH_BAR_PADDING_TOP,
          paddingHorizontal: SEARCH_BAR_PADDING_X,
        }}
      >
        <LinearGradient
          colors={['rgba(232,225,210,0.95)', 'rgba(232,225,210,0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 120 }}
          pointerEvents="none"
        />
        <View style={{ height: SEARCH_BAR_HEIGHT }}>
          {showBar && (
            <View
              className="absolute left-0 right-0 top-0 flex-row items-center bg-paper rounded-full"
              style={{
                height: SEARCH_BAR_HEIGHT,
                paddingHorizontal: SEARCH_BAR_INNER_PX,
                gap: SEARCH_BAR_ICON_GAP,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <SearchIcon size={SEARCH_BAR_ICON_SIZE} color={TOKENS.mute} strokeWidth={1.8} />
              <Text className="flex-1 font-sans text-[13px] text-mute">장소 · 테마 · 시대 검색</Text>
            </View>
          )}
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

      {/* 바텀 시트 — 드래그 가능 */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        bottomInset={84}
        enablePanDownToClose={false}
        handleIndicatorStyle={{ backgroundColor: TOKENS.line, width: 40, height: 4 }}
        backgroundStyle={{
          backgroundColor: TOKENS.paper,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <BottomSheetView className="px-5 pt-2 pb-3 flex-row justify-between items-center">
          <Text className="font-serif text-[16px] text-ink">내 주변 {visible.length}곳</Text>
          <Text className="font-sans text-[11px] text-mute">가까운 순</Text>
        </BottomSheetView>

        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: insets.bottom + 24,
            gap: 10,
          }}
        >
          {nearby.map((p) => {
            const stamped = STAMPED.includes(p.id);
            return (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/place/${p.id}` as never)}
                className="flex-row gap-3 p-3 bg-paper border border-line rounded-xl items-center"
              >
                <PhotoPlaceholder height={64} width={64} />
                <View className="flex-1">
                  <View className="flex-row items-center gap-1.5 mb-0.5">
                    <Tag color={p.accent}>{p.era}</Tag>
                    {stamped && (
                      <Text className="font-sans-bold text-[10px] text-red">● 획득</Text>
                    )}
                  </View>
                  <Text className="font-serif text-[15px] text-ink">{p.name}</Text>
                  <Text numberOfLines={1} className="font-mono text-[10px] text-mute mt-0.5">
                    {p.distance}km · {p.region}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
