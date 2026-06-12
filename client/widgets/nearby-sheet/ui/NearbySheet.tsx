import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { TOKENS } from '@shared/lib/tokens';
import { nearbyInfiniteQueryOptions } from '@entities/place/api/queries';
import { stampedQueryOptions } from '@entities/stamp/api/queries';
import { useUserCoords } from '@entities/user/model/locationStore';
import { useSearchState } from '@features/search-transition/model/store';
import type { Place } from '@entities/place/model/types';
import { PlaceRow, PLACE_ROW_COMPACT_HEIGHT } from '@entities/place/ui/PlaceRow';

const PAGE_LIMIT = 10;
const ROW_GAP = 10;
const SNAP_POINTS = ['25%', '55%', '90%'];

const keyExtractor = (p: Place) => p.id;
const Separator = () => <View style={{ height: ROW_GAP }} />;

type Props = {
  filter: string;
  insets: EdgeInsets;
};

export function NearbySheet({ filter, insets }: Props) {
  const router = useRouter();
  const userCoords = useUserCoords();
  const searchTransition = useSearchState();

  const [fetchReady, setFetchReady] = useState(!searchTransition.active);
  useEffect(() => {
    if (!searchTransition.active && !fetchReady) {
      setFetchReady(true);
    }
  }, [searchTransition.active, fetchReady]);

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => SNAP_POINTS, []);

  const nearbyQuery = useInfiniteQuery({
    ...nearbyInfiniteQueryOptions({
      lat: userCoords.lat,
      lon: userCoords.lon,
      radius: 30,
      limit: PAGE_LIMIT,
      era: filter,
    }),
    enabled: fetchReady,
  });

  const stampedQuery = useQuery({
    ...stampedQueryOptions(),
    enabled: fetchReady,
  });

  const nearby: Place[] = useMemo(() => {
    if (!fetchReady || !nearbyQuery.data) return [];
    return nearbyQuery.data.pages.flatMap((p) => p.items);
  }, [fetchReady, nearbyQuery.data]);

  const total = fetchReady ? (nearbyQuery.data?.pages[0]?.total ?? 0) : 0;
  const stampedSet = useMemo(() => new Set(stampedQuery.data ?? []), [stampedQuery.data]);
  const showLoading = !fetchReady || nearbyQuery.isLoading;

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);
      if (
        distanceFromBottom < 400 &&
        nearbyQuery.hasNextPage &&
        !nearbyQuery.isFetchingNextPage
      ) {
        nearbyQuery.fetchNextPage();
      }
    },
    [nearbyQuery]
  );

  const onPressPlace = useCallback(
    (id: string) => router.push(`/place/${id}` as never),
    [router]
  );

  const renderItem = useCallback(
    ({ item }: { item: Place }) => (
      <PlaceRow
        place={item}
        stamped={stampedSet.has(item.id)}
        onPress={onPressPlace}
        variant="compact"
      />
    ),
    [stampedSet, onPressPlace]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Place> | null | undefined, index: number) => ({
      length: PLACE_ROW_COMPACT_HEIGHT,
      offset: (PLACE_ROW_COMPACT_HEIGHT + ROW_GAP) * index,
      index,
    }),
    []
  );

  return (
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
        onMomentumScrollEnd={onMomentumScrollEnd}
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
  );
}
