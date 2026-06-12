import { queryOptions } from '@tanstack/react-query';
import { STALE, GC } from '@shared/config/query-config';
import { getTopic, getTopics } from './client';
import { topicQueryKeys } from './queryKeys';

export const topicsQueryOptions = () =>
  queryOptions({
    queryKey: topicQueryKeys.list(),
    queryFn: ({ signal }) => getTopics(signal),
    staleTime: STALE.LONG,
    gcTime: GC.LONG,
  });

export const topicQueryOptions = (id: string) =>
  queryOptions({
    queryKey: topicQueryKeys.detail(id),
    queryFn: ({ signal }) => getTopic(id, signal),
    staleTime: STALE.LONG,
    gcTime: GC.LONG,
  });
