import Constants from 'expo-constants';
import ky, { HTTPError } from 'ky';

import type { Place } from '@entities/place/model/types';
import type { Theme } from '@entities/theme/model/types';
import type { Achievement, Level, RankInfo, RankingEntry } from '@entities/user/model/types';

// 실기기는 Metro의 LAN IP를 자동 추출하므로 Wi-Fi가 바뀌어도 IP를 갱신할 필요 없음.
// EXPO_PUBLIC_API_BASE로 명시 override 가능 (스테이징/프로덕션 빌드용).
const host = Constants.expoConfig?.hostUri?.split(':')[0];
const BASE = process.env.EXPO_PUBLIC_API_BASE ?? `http://${host ?? 'localhost'}:3000/api`;

/** API 에러. 상태코드 + 서버 응답 body까지 보존해서 디버깅 가능. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const client = ky.create({
  timeout: 10_000,
  retry: 0, // React Query가 재시도 정책 담당. 두 군데서 retry하면 backoff 의도가 깨짐.
});

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    return await client.get(`${BASE}${path}`, { signal }).json<T>();
  } catch (err) {
    if (err instanceof HTTPError) {
      let body: unknown = '';
      try {
        body = await err.response.clone().json();
      } catch {
        body = await err.response.clone().text().catch(() => '');
      }
      const detail =
        typeof body === 'object' && body && 'error' in body
          ? String((body as { error: unknown }).error)
          : typeof body === 'string' && body
            ? body
            : '';
      throw new ApiError(
        err.response.status,
        body,
        detail
          ? `${err.response.status} ${err.response.statusText}: ${detail}`
          : `${err.response.status} ${err.response.statusText}`
      );
    }
    throw err;
  }
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
  places: (signal?: AbortSignal) => get<Place[]>('/places', signal),
  place: (id: string, coords?: { lat: number; lon: number }, signal?: AbortSignal) => {
    const q = coords ? `?lat=${coords.lat}&lon=${coords.lon}` : '';
    return get<Place>(`/places/${id}${q}`, signal);
  },
  /** 서버측에서 거리 계산 + 정렬 + 페이징된 가까운 장소. */
  nearby: (
    { lat, lon, radius = 20, limit = 50, page = 1, era }: NearbyParams,
    signal?: AbortSignal
  ) => {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      radius: String(radius),
      limit: String(limit),
      page: String(page),
    });
    if (era && era !== '전체') params.set('era', era);
    return get<NearbyResponse>(`/places/nearby?${params.toString()}`, signal);
  },
  stamped: (signal?: AbortSignal) => get<string[]>('/stamped', signal),
  /** 최근 스탬프 + 글리프/색 (홈 표시용 가벼운 응답). */
  recentStamps: (limit = 6, signal?: AbortSignal) =>
    get<{ id: string; glyph: string; accent: string }[]>(
      `/stamps/recent?limit=${limit}`,
      signal
    ),

  themes: (signal?: AbortSignal) => get<Theme[]>('/themes', signal),
  theme: (id: string, signal?: AbortSignal) => get<Theme>(`/themes/${id}`, signal),

  me: (signal?: AbortSignal) =>
    get<{
      nickname: string;
      joinedAt: string;
      daysActive: number;
      stamps: number;
      quizCorrect: number;
      themesCompleted: number;
      xp: number;
      rank: RankInfo;
    }>('/me', signal),
  achievements: (signal?: AbortSignal) => get<Achievement[]>('/achievements', signal),
  ranking: (signal?: AbortSignal) => get<RankingEntry[]>('/ranking', signal),
  levels: (signal?: AbortSignal) => get<Level[]>('/levels', signal),
};
