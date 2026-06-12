import { queryOptions } from '@tanstack/react-query';
import { STALE, GC } from '@shared/config/query-config';
import { getStamped, getRecentStamps } from './client';
import { stampQueryKeys } from './queryKeys';

export const stampedQueryOptions = () =>
  queryOptions({
    queryKey: stampQueryKeys.stamped(),
    queryFn: ({ signal }) => getStamped(signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });

export const recentStampsQueryOptions = (limit = 6) =>
  queryOptions({
    queryKey: stampQueryKeys.recent(limit),
    queryFn: ({ signal }) => getRecentStamps(limit, signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
