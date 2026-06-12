import { get } from '@shared/api/base';
import type { Theme } from '@entities/theme/model/types';

export const getThemes = (signal?: AbortSignal) => get<Theme[]>('/themes', signal);
export const getTheme = (id: string, signal?: AbortSignal) => get<Theme>(`/themes/${id}`, signal);
