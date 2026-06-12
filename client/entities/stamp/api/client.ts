import { get } from '@shared/api/base';

export type RecentStamp = { id: string; glyph: string; accent: string };

export const getStamped = (signal?: AbortSignal) => get<string[]>('/stamped', signal);

/** 최근 스탬프 + 글리프/색 (홈 표시용 가벼운 응답). */
export const getRecentStamps = (limit = 6, signal?: AbortSignal) =>
  get<RecentStamp[]>(`/stamps/recent?limit=${limit}`, signal);
