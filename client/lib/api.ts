import type { Place } from '../data/places';
import type { Theme } from '../data/themes';
import type { Artifact } from '../data/artifacts';
import type { Figure } from '../data/figures';
import type { TodayEntry } from '../data/today';
import type { Achievement, Level, RankInfo, RankingEntry } from '../data/user';

// 실기기에선 LAN IP 필요 (시뮬레이터는 localhost OK).
// 같은 Wi-Fi에 폰+Mac 있으면 Mac의 LAN IP로 폰이 접근.
// IP 바뀌면 ipconfig getifaddr en0 으로 확인 후 갱신.
const BASE =
  process.env.EXPO_PUBLIC_API_BASE ?? 'http://192.168.0.24:3000/api';

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
  place: (id: string) => get<Place>(`/places/${id}`),
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
    get<{ id: string; glyph: string; accent: string }[]>(
      `/stamps/recent?limit=${limit}`,
    ),

  themes: () => get<Theme[]>('/themes'),
  theme: (id: string) => get<Theme>(`/themes/${id}`),

  artifacts: () => get<Artifact[]>('/artifacts'),
  artifact: (id: string) => get<Artifact>(`/artifacts/${id}`),

  figures: () => get<Figure[]>('/figures'),
  figure: (id: string) => get<Figure>(`/figures/${id}`),

  today: () => get<TodayEntry[]>('/today'),

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

export const queryKeys = {
  places: ['places'] as const,
  place: (id: string) => ['places', id] as const,
  nearby: (
    lat: number,
    lon: number,
    opts: { radius?: number; limit?: number; era?: string } = {},
  ) =>
    [
      'places',
      'nearby',
      { lat, lon, radius: opts.radius ?? 20, limit: opts.limit ?? 50, era: opts.era },
    ] as const,
  stamped: ['stamped'] as const,
  recentStamps: (limit = 6) => ['stamps', 'recent', limit] as const,
  themes: ['themes'] as const,
  theme: (id: string) => ['themes', id] as const,
  artifacts: ['artifacts'] as const,
  artifact: (id: string) => ['artifacts', id] as const,
  figures: ['figures'] as const,
  figure: (id: string) => ['figures', id] as const,
  today: ['today'] as const,
  me: ['me'] as const,
  achievements: ['achievements'] as const,
  ranking: ['ranking'] as const,
  levels: ['levels'] as const,
};
