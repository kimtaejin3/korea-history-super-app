import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import { api, type NearbyParams, type NearbyResponse } from '@shared/api/base';
import { queryKeys } from '@shared/api/queryKeys';
import { STALE, GC } from '@shared/config/query-config';

export const placesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.places.list(),
    queryFn: ({ signal }) => api.places(signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const placeQueryOptions = (id: string, coords?: { lat: number; lon: number }) =>
  queryOptions({
    queryKey: queryKeys.places.detail(id, coords),
    queryFn: ({ signal }) => api.place(id, coords, signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

/** 단일 페이지 fetch (홈처럼 페이지네이션 불필요한 곳). */
export const nearbyQueryOptions = (params: NearbyParams) =>
  queryOptions({
    queryKey: queryKeys.places.nearby(params.lat, params.lon, {
      radius: params.radius,
      limit: params.limit,
      era: params.era,
    }),
    queryFn: ({ signal }) => api.nearby(params, signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });

/** 무한 페이지네이션 (지도처럼 스크롤 시 다음 페이지 자동 fetch). */
export const nearbyInfiniteQueryOptions = (params: NearbyParams) =>
  infiniteQueryOptions({
    queryKey: [
      ...queryKeys.places.nearby(params.lat, params.lon, {
        radius: params.radius,
        limit: params.limit,
        era: params.era,
      }),
      'infinite',
    ] as const,
    queryFn: ({ pageParam, signal }) => api.nearby({ ...params, page: pageParam }, signal),
    initialPageParam: 1,
    getNextPageParam: (last: NearbyResponse) => (last.hasMore ? last.page + 1 : undefined),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
