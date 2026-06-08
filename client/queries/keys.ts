/**
 * React Query queryKey 팩토리.
 *
 * TkDodo 권장 패턴 — `all → 카테고리 → 구체` 계층 구조로
 * `invalidateQueries({ queryKey: queryKeys.places.all })` 같은 일괄 무효화가 자연스러움.
 */

import type { NearbyParams } from '../lib/api';

export const queryKeys = {
  places: {
    all: ['places'] as const,
    list: () => [...queryKeys.places.all, 'list'] as const,
    details: () => [...queryKeys.places.all, 'detail'] as const,
    detail: (id: string, coords?: { lat: number; lon: number }) =>
      coords
        ? ([...queryKeys.places.details(), id, coords] as const)
        : ([...queryKeys.places.details(), id] as const),
    nearby: (lat: number, lon: number, opts: Omit<NearbyParams, 'lat' | 'lon'> = {}) =>
      [
        ...queryKeys.places.all,
        'nearby',
        { lat, lon, radius: opts.radius ?? 20, limit: opts.limit ?? 50, era: opts.era },
      ] as const,
  },
  themes: {
    all: ['themes'] as const,
    list: () => [...queryKeys.themes.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.themes.all, 'detail', id] as const,
  },
  stamps: {
    all: ['stamps'] as const,
    stamped: () => [...queryKeys.stamps.all, 'stamped'] as const,
    recent: (limit: number) => [...queryKeys.stamps.all, 'recent', limit] as const,
  },
  me: ['me'] as const,
  achievements: ['achievements'] as const,
  ranking: ['ranking'] as const,
  levels: ['levels'] as const,
} as const;
