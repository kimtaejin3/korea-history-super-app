import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/base';
import { queryKeys } from '@shared/api/queryKeys';
import { STALE, GC } from '@shared/config/query-config';

export const stampedQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.stamps.stamped(),
    queryFn: ({ signal }) => api.stamped(signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });

export const recentStampsQueryOptions = (limit = 6) =>
  queryOptions({
    queryKey: queryKeys.stamps.recent(limit),
    queryFn: ({ signal }) => api.recentStamps(limit, signal),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
