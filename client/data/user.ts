// 클라이언트가 서버 API 응답을 타이핑할 때 쓰는 타입 정의.
// 사용자/업적/랭킹/등급 데이터는 모두 Postgres에서 옴.

export type Level = {
  level: number;
  name: string;
  hanja: string;
  minXp: number;
  color: string;
  desc: string;
  perks: string[];
};

export type RankInfo = {
  current: Level;
  next: Level | null;
  progress: number;
  xpToNext: number;
};

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  progress?: number;
  max?: number;
};

export type RankingEntry = {
  rank: number;
  name: string;
  stamps: number;
  badge: string;
  me?: boolean;
};
