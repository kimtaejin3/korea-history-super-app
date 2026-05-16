import type { Place } from '../data/places';
import type { Theme } from '../data/themes';
import type { Artifact } from '../data/artifacts';
import type { Figure } from '../data/figures';
import type { TodayEntry } from '../data/today';
import type { Achievement, Level, RankInfo, RankingEntry } from '../data/user';

const BASE = 'http://localhost/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  places: () => get<Place[]>('/places'),
  place: (id: string) => get<Place>(`/places/${id}`),
  stamped: () => get<string[]>('/stamped'),

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
  stamped: ['stamped'] as const,
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
