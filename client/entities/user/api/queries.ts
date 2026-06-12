import { queryOptions } from '@tanstack/react-query';
import { STALE, GC } from '@shared/config/query-config';
import { getMe, getLevels, getAchievements, getRanking } from './client';
import { userQueryKeys } from './queryKeys';

export const meQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.me,
    queryFn: ({ signal }) => getMe(signal),
    staleTime: STALE.SHORT,
    gcTime: GC.MEDIUM,
  });

export const levelsQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.levels,
    queryFn: ({ signal }) => getLevels(signal),
    staleTime: STALE.LONG,
    gcTime: GC.LONG,
  });

export const achievementsQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.achievements,
    queryFn: ({ signal }) => getAchievements(signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const rankingQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.ranking,
    queryFn: ({ signal }) => getRanking(signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
