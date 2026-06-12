import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api/base';
import { queryKeys } from '@shared/api/queryKeys';
import { STALE, GC } from '@shared/config/query-config';

export const themesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.themes.list(),
    queryFn: api.themes,
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const themeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.themes.detail(id),
    queryFn: () => api.theme(id),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });
