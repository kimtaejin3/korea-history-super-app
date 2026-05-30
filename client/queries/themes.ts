import { queryOptions } from '@tanstack/react-query';
import { api } from '../lib/api';
import { queryKeys } from './keys';
import { STALE, GC } from './config';

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
