import Constants from 'expo-constants';

import type { Place } from '../types/places';
import type { Theme } from '../types/themes';
import type { Achievement, Level, RankInfo, RankingEntry } from '../types/user';

// 실기기는 Metro의 LAN IP를 자동 추출하므로 Wi-Fi가 바뀌어도 IP를 갱신할 필요 없음.
// EXPO_PUBLIC_API_BASE로 명시 override 가능 (스테이징/프로덕션 빌드용).
const host = Constants.expoConfig?.hostUri?.split(':')[0];
const BASE = process.env.EXPO_PUBLIC_API_BASE ?? `http://${host ?? 'localhost'}:3000/api`;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export type NearbyParams = {
  lat: number;
  lon: number;
  radius?: number;
  limit?: number;
  page?: number;
  era?: string;
};

export type NearbyResponse = {
  items: Place[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export const api = {
  places: () => get<Place[]>('/places'),
  place: (id: string, coords?: { lat: number; lon: number }) => {
    const q = coords ? `?lat=${coords.lat}&lon=${coords.lon}` : '';
    return get<Place>(`/places/${id}${q}`);
  },
  /** 서버측에서 거리 계산 + 정렬 + 페이징된 가까운 장소. */
  nearby: ({ lat, lon, radius = 20, limit = 50, page = 1, era }: NearbyParams) => {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      radius: String(radius),
      limit: String(limit),
      page: String(page),
    });
    if (era && era !== '전체') params.set('era', era);
    return get<NearbyResponse>(`/places/nearby?${params.toString()}`);
  },
  stamped: () => get<string[]>('/stamped'),
  /** 최근 스탬프 + 글리프/색 (홈 표시용 가벼운 응답). */
  recentStamps: (limit = 6) =>
    get<{ id: string; glyph: string; accent: string }[]>(`/stamps/recent?limit=${limit}`),

  themes: () => get<Theme[]>('/themes'),
  theme: (id: string) => get<Theme>(`/themes/${id}`),

  me: () =>
    get<{
      nickname: string;
      joinedAt: string;
      daysActive: number;
      stamps: number;
      quizCorrect: number;
      themesCompleted: number;
      xp: number;
      rank: RankInfo;
    }>('/me'),
  achievements: () => get<Achievement[]>('/achievements'),
  ranking: () => get<RankingEntry[]>('/ranking'),
  levels: () => get<Level[]>('/levels'),
};

