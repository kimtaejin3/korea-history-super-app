import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { TOKENS } from '../../lib/tokens';
import { nearbyInfiniteQueryOptions } from '../../queries/places';
import { stampedQueryOptions } from '../../queries/stamps';
import { useUserCoords } from '../../stores/userLocation';
import { useSearchState } from '../../stores/searchTransition';
import { formatDistance } from '../../lib/geo';
import type { Place } from '../../types/places';
import { Tag } from '../Tag';
import { PhotoPlaceholder } from '../PhotoPlaceholder';

const PAGE_LIMIT = 10;
const ROW_HEIGHT = 88;
const ROW_GAP = 10;
const SNAP_POINTS = ['25%', '55%', '90%'];

const keyExtractor = (p: Place) => p.id;
const Separator = () => <View style={{ height: ROW_GAP }} />;

const PlaceRow = memo(function PlaceRow({
  place: p,
  stamped,
  onPress,
}: {
  place: Place;
  stamped: boolean;
  onPress: (id: string) => void;
}) {
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
