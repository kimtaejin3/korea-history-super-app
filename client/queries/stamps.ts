import { queryOptions } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryKeys } from './keys';
import { STALE, GC } from './config';

export const stampedQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.stamps.stamped(),
    queryFn: api.stamped,
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });

export const recentStampsQueryOptions = (limit = 6) =>
  queryOptions({
    queryKey: queryKeys.stamps.recent(limit),
    queryFn: () => api.recentStamps(limit),
    staleTime: STALE.SHORT,
    gcTime: GC.SHORT,
  });
