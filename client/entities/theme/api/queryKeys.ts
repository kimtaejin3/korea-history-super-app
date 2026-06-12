export const themeQueryKeys = {
  all: ['themes'] as const,
  list: () => [...themeQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...themeQueryKeys.all, 'detail', id] as const,
};
