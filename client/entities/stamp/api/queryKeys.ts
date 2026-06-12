export const stampQueryKeys = {
  all: ['stamps'] as const,
  stamped: () => [...stampQueryKeys.all, 'stamped'] as const,
  recent: (limit: number) => [...stampQueryKeys.all, 'recent', limit] as const,
};
