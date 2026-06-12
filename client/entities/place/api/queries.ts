import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { STALE, GC } from '@shared/config/query-config';
import {
  getPlaces,
  getPlace,
  getNearby,
  type NearbyParams,
  type NearbyResponse,
} from './client';
import { placeQueryKeys } from './queryKeys';

export const placesQueryOptions = () =>
  queryOptions({
    queryKey: placeQueryKeys.list(),
    queryFn: ({ signal }) => getPlaces(signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const placeQueryOptions = (id: string, coords?: { lat: number; lon: number }) =>
  queryOptions({
    queryKey: placeQueryKeys.detail(id, coords),
    queryFn: ({ signal }) => getPlace(id, coords, signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

/** 단일 페이지 fetch (홈처럼 페이지네이션 불필요한 곳). */
export const nearbyQueryOptions = (params: NearbyParams) =>
  queryOptions({
    queryKey: placeQueryKeys.nearby(params.lat, params.lon, {
      radius: params.radius,
      limit: params.limit,
      era: params.era,
    }),
    queryFn: ({ signal }) => getNearby(params, signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });

/** 무한 페이지네이션 (지도처럼 스크롤 시 다음 페이지 자동 fetch). */
export const nearbyInfiniteQueryOptions = (params: NearbyParams) =>
  infiniteQueryOptions({
    queryKey: [
      ...placeQueryKeys.nearby(params.lat, params.lon, {
        radius: params.radius,
        limit: params.limit,
        era: params.era,
      }),
      'infinite',
    ] as const,
    queryFn: ({ pageParam, signal }) => getNearby({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (last: NearbyResponse) => (last.hasMore ? last.page + 1 : undefined),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
