import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/base';
import { queryKeys } from '@shared/api/queryKeys';
import { STALE, GC } from '@shared/config/query-config';

export const meQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.me,
    queryFn: ({ signal }) => api.me(signal),
    staleTime: STALE.SHORT,
    gcTime: GC.MEDIUM,
  });

export const levelsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.levels,
    queryFn: ({ signal }) => api.levels(signal),
    staleTime: STALE.LONG,
    gcTime: GC.LONG,
  });

export const achievementsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.achievements,
    queryFn: ({ signal }) => api.achievements(signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const rankingQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.ranking,
    queryFn: ({ signal }) => api.ranking(signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
