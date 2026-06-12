export const topicQueryKeys = {
  all: ['topics'] as const,
  list: () => [...topicQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...topicQueryKeys.all, 'detail', id] as const,
};
