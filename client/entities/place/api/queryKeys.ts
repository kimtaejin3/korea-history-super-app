import type { NearbyParams } from './client';

export const placeQueryKeys = {
  all: ['places'] as const,
  list: () => [...placeQueryKeys.all, 'list'] as const,
  details: () => [...placeQueryKeys.all, 'detail'] as const,
  detail: (id: string, coords?: { lat: number; lon: number }) =>
    coords
      ? ([...placeQueryKeys.details(), id, coords] as const)
      : ([...placeQueryKeys.details(), id] as const),
  nearby: (lat: number, lon: number, opts: Omit<NearbyParams, 'lat' | 'lon'> = {}) =>
    [
      ...placeQueryKeys.all,
      'nearby',
      { lat, lon, radius: opts.radius ?? 20, limit: opts.limit ?? 50, era: opts.era },
    ] as const,
};
