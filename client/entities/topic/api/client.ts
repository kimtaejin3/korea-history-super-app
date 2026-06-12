import { get } from '@shared/api/base';
import type { Topic } from '@entities/topic/model/types';

export const getTopics = (signal?: AbortSignal) => get<Topic[]>('/topics', signal);
export const getTopic = (id: string, signal?: AbortSignal) => get<Topic>(`/topics/${id}`, signal);
