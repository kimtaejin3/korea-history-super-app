import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/base';
import { queryKeys } from '@shared/api/queryKeys';
import { STALE, GC } from '@shared/config/query-config';

export const themesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.themes.list(),
    queryFn: ({ signal }) => api.themes(signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const themeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.themes.detail(id),
    queryFn: ({ signal }) => api.theme(id, signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });
