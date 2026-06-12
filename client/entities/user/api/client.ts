import { get } from '@shared/api/base';
import type {
  Achievement,
  Level,
  RankInfo,
  RankingEntry,
} from '@entities/user/model/types';

export type Me = {
  nickname: string;
  joinedAt: string;
  daysActive: number;
  stamps: number;
  quizCorrect: number;
  themesCompleted: number;
  xp: number;
  rank: RankInfo;
};

export const getMe = (signal?: AbortSignal) => get<Me>('/me', signal);
export const getLevels = (signal?: AbortSignal) => get<Level[]>('/levels', signal);
export const getAchievements = (signal?: AbortSignal) =>
  get<Achievement[]>('/achievements', signal);
export const getRanking = (signal?: AbortSignal) => get<RankingEntry[]>('/ranking', signal);
