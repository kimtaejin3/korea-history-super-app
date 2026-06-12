import { queryOptions } from '@tanstack/react-query';
import { STALE, GC } from '@shared/config/query-config';
import { getThemes, getTheme } from './client';
import { themeQueryKeys } from './queryKeys';

export const themesQueryOptions = () =>
  queryOptions({
    queryKey: themeQueryKeys.list(),
    queryFn: ({ signal }) => getThemes(signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });

export const themeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: themeQueryKeys.detail(id),
    queryFn: ({ signal }) => getTheme(id, signal),
    staleTime: STALE.MEDIUM,
    gcTime: GC.MEDIUM,
  });
