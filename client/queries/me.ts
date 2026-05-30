import { queryOptions } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryKeys } from './keys';
import { STALE, GC } from './config';

export const meQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.me,
    queryFn: api.me,
    staleTime: STALE.SHORT,
    gcTime: GC.MEDIUM,
  });

export const levelsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.levels,
    queryFn: api.levels,
    staleTime: STALE.LONG,
    gcTime: GC.LONG,
  });

export const achievementsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.achievements,
    queryFn: api.achievements,
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const rankingQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.ranking,
    queryFn: api.ranking,
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
