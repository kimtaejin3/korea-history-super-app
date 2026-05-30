// noinspection JSUnusedGlobalSymbols

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys, type NearbyResponse } from '../../lib/api';
import type { Place } from '../../data/places';
import { Tag } from '../../components/Tag';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { SearchIcon } from '../../components/icons';
import { useSearchState } from '../../stores/searchTransition';
import {
  SEARCH_BAR_HEIGHT,
  SEARCH_BAR_ICON_GAP,
  SEARCH_BAR_ICON_SIZE,
  SEARCH_BAR_INNER_PX,
  SEARCH_BAR_PADDING_TOP,
  SEARCH_BAR_PADDING_X,
} from '../../lib/searchBarLayout';
import { formatDistance } from '../../lib/geo';
import { useUserLocation } from '../../lib/useUserLocation';

const FILTERS = ['전체', '조선', '백제', '통일신라', '근현대'];
const PAGE_LIMIT = 10;

// 행 높이 고정 → getItemLayout으로 위치 기반 정확한 가상화 + 측정 비용 제거.
// 사진 64 + p-3(12*2) 패딩 = 88. 이름/주소는 numberOfLines={1}로 1줄 고정.
const ROW_HEIGHT = 88;
const ROW_GAP = 10;

const keyExtractor = (p: Place) => p.id;
const Separator = () => <View style={{ height: ROW_GAP }} />;

type PlaceRowProps = {
  place: Place;
  stamped: boolean;
  onPress: (id: string) => void;
};

// 행을 memo로 분리 → 부모(MapScreen) 리렌더가 각 행에 전파되지 않음.
// props(place·stamped·onPress)가 같으면 재렌더 스킵.
const PlaceRow = memo(function PlaceRow({ place: p, stamped, onPress }: PlaceRowProps) {
  return (
    <Pressable
      onPress={() => onPress(p.id)}
      className="flex-row gap-3 p-3 bg-paper border border-line rounded-xl items-center"
      style={{ height: ROW_HEIGHT }}
    >
      <PhotoPlaceholder height={64} width={64} photoUrl={p.photo?.url} />
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 mb-0.5">
          <Tag color={p.accent}>{p.era}</Tag>
          {stamped && <Text className="font-sans-bold text-[10px] text-red">● 획득</Text>}
        </View>
        <Text numberOfLines={1} className="font-serif text-[15px] text-ink">
          {p.name}
        </Text>
        <Text numberOfLines={1} className="font-mono text-[10px] text-mute mt-0.5">
          {formatDistance(p.distance)} · {p.region}
        </Text>
      </View>
    </Pressable>
  );
});

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [filter, setFilter] = useState('전체');

  const { coords: userCoords } = useUserLocation();
  const searchTransition = useSearchState();
  const showBar = !searchTransition.active;

  // 검색바 morph 진입 시: morph 끝난 뒤 fetch 시작.
  // 탭 직접 진입 시: morph가 active 아니므로 즉시 ready.
  const [fetchReady, setFetchReady] = useState(!searchTransition.active);
  useEffect(() => {
    if (!searchTransition.active && !fetchReady) {
      setFetchReady(true);
    }
  }, [searchTransition.active, fetchReady]);

  // 무한 페이지네이션 — 한 페이지 PAGE_LIMIT개, 스크롤 끝 도달 시 다음 페이지 fetch
  const nearbyQuery = useInfiniteQuery({
    queryKey: queryKeys.nearby(userCoords.lat, userCoords.lon, {
      radius: 30,
      limit: PAGE_LIMIT,
      era: filter,
    }),
    queryFn: ({ pageParam }) =>
      api.nearby({
        lat: userCoords.lat,
        lon: userCoords.lon,
        radius: 30,
        limit: PAGE_LIMIT,
        page: pageParam,
        era: filter,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: NearbyResponse) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: fetchReady,
  });

  const stampedQuery = useQuery({
    queryKey: queryKeys.stamped,
    queryFn: api.stamped,
    enabled: fetchReady,
  });

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '55%', '90%'], []);

  // 모든 페이지 flatten — useMemo로 페이지 추가 시에만 재계산.
  // fetchReady 전(=morph 진행 중)엔 캐시가 있어도 노출하지 않음.
  // → enabled:fetchReady는 네트워크 fetch만 막지만, useInfiniteQuery는
  //   캐시가 있으면 enabled:false여도 data를 즉시 반환하므로 여기서도 게이팅.
  //   결과: 캐시 여부와 무관하게 애니메이션 종료 후 데이터가 한 번에 나타남.
  const nearby: Place[] = useMemo(() => {
    if (!fetchReady || !nearbyQuery.data) return [];
    return nearbyQuery.data.pages.flatMap((p) => p.items);
  }, [fetchReady, nearbyQuery.data]);
  const total = fetchReady ? (nearbyQuery.data?.pages[0]?.total ?? 0) : 0;
  // Set으로 조회 O(1) (이전엔 행마다 Array.includes → O(n))
  const stampedSet = useMemo(() => new Set(stampedQuery.data ?? []), [stampedQuery.data]);

  // morph가 끝나기 전엔 항상 로딩 표시 (캐시가 있든 없든 동일).
  const showLoading = !fetchReady || nearbyQuery.isLoading;

  const onEndReached = useCallback(() => {
    if (nearbyQuery.hasNextPage && !nearbyQuery.isFetchingNextPage) {
      nearbyQuery.fetchNextPage();
    }
  }, [nearbyQuery]);

  const onPressPlace = useCallback((id: string) => router.push(`/place/${id}` as never), [router]);

  // renderItem 참조 고정 → 부모 리렌더마다 새 함수가 안 생겨 행 재렌더 방지.
  const renderItem = useCallback(
    ({ item }: { item: Place }) => (
      <PlaceRow place={item} stamped={stampedSet.has(item.id)} onPress={onPressPlace} />
    ),
    [stampedSet, onPressPlace]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Place> | null | undefined, index: number) => ({
      length: ROW_HEIGHT,
      offset: (ROW_HEIGHT + ROW_GAP) * index,
      index,
    }),
    []
  );

  return (
    <View className="flex-1 bg-[#E8E1D2]">
      {/* 상단 검색 + 필터 — 데이터 상태와 무관하게 항상 표시 */}
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
          {showBar && (
            <View
              className="absolute left-0 right-0 top-0 flex-row items-center bg-paper rounded-full"
              style={{
                height: SEARCH_BAR_HEIGHT,
                paddingHorizontal: SEARCH_BAR_INNER_PX,
                gap: SEARCH_BAR_ICON_GAP,
              }}
            >
              <SearchIcon size={SEARCH_BAR_ICON_SIZE} color={TOKENS.mute} strokeWidth={1.8} />
              <Text className="flex-1 font-sans text-[13px] text-mute">
                장소 · 테마 · 시대 검색
              </Text>
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

      {/* 바텀 시트 — 데이터 없어도 항상 렌더, 안에서 로딩 표시 */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        topInset={insets.top + 8}
        bottomInset={84}
        enablePanDownToClose={false}
        handleIndicatorStyle={{
          backgroundColor: TOKENS.line,
          width: 40,
          height: 4,
        }}
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
        <View className="px-5 pt-2 pb-3 flex-row justify-between items-center">
          <Text className="font-serif text-[16px] text-ink">
            {showLoading
              ? '불러오는 중…'
              : `내 주변 ${nearby.length}${total > nearby.length ? `/${total}` : ''}곳`}
          </Text>
          <Text className="font-sans text-[11px] text-mute">가까운 순</Text>
        </View>

        <BottomSheetFlatList
          data={nearby}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: insets.bottom + 24,
          }}
          ItemSeparatorComponent={Separator}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          windowSize={7}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          ListEmptyComponent={
            showLoading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="small" color={TOKENS.mute} />
              </View>
            ) : nearbyQuery.isError ? (
              <View className="py-12 items-center">
                <Text className="font-sans text-[12px] text-mute">데이터를 가져오지 못했어요</Text>
                <Pressable
                  onPress={() => nearbyQuery.refetch()}
                  className="mt-4 px-5 py-2.5 bg-ink rounded-full"
                >
                  <Text className="font-sans-bold text-[13px] text-paper">다시 시도</Text>
                </Pressable>
              </View>
            ) : (
              <View className="py-12 items-center">
                <Text className="font-sans text-[12px] text-mute">결과가 없어요</Text>
              </View>
            )
          }
          ListFooterComponent={
            nearbyQuery.isFetchingNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={TOKENS.mute} />
              </View>
            ) : null
          }
        />
      </BottomSheet>
    </View>
  );
}
