import { STAMPED } from './places';

export type Level = {
  level: number;
  name: string;
  hanja: string;
  minXp: number;
  color: string;
  desc: string;
  perks: string[];
};

export const LEVELS: Level[] = [
  {
    level: 1,
    name: '초학',
    hanja: '初學',
    minXp: 0,
    color: '#86858A',
    desc: '역사의 첫 발을 디딘 사람',
    perks: ['스탬프 수집', '테마 참여', '지도 탐색'],
  },
  {
    level: 2,
    name: '답사생',
    hanja: '踏査生',
    minXp: 50,
    color: '#7A6450',
    desc: '직접 걸으며 흔적을 모으는 자',
    perks: ['현장 사진 업로드', '방문 후기 작성'],
  },
  {
    level: 3,
    name: '사림',
    hanja: '士林',
    minXp: 150,
    color: '#4F6B5C',
    desc: '학문으로 길을 가르는 선비',
    perks: ['현장 퀴즈 제안', '오류 신고'],
  },
  {
    level: 4,
    name: '학사',
    hanja: '學士',
    minXp: 300,
    color: '#1F3A52',
    desc: '경서에 통달한 학자',
    perks: ['장소 정보 보완 제안', '한자 표기 교정'],
  },
  {
    level: 5,
    name: '진사',
    hanja: '進士',
    minXp: 500,
    color: '#5A3A8C',
    desc: '과거에 급제한 진사',
    perks: ['신규 장소 등록 제안', '도감 큐레이션'],
  },
  {
    level: 6,
    name: '대제학',
    hanja: '大提學',
    minXp: 800,
    color: '#9C2F1B',
    desc: '문형(文衡)을 잡은 학문의 수장',
    perks: ['테마 코스 직접 제작', '커뮤니티 답사 모집'],
  },
  {
    level: 7,
    name: '사관',
    hanja: '史官',
    minXp: 1200,
    color: '#141413',
    desc: '역사를 기록하는 최고 책임자',
    perks: ['신규 등록 검수 권한', '명예의 전당 등재'],
  },
];

export const USER = {
  nickname: '답사초보',
  joinedAt: '2026.01',
  daysActive: 142,
  stamps: STAMPED.length,
  quizCorrect: 7,
  themesCompleted: 0,
  get xp() {
    return this.stamps * 10 + this.quizCorrect * 5 + this.themesCompleted * 50;
  },
} as const;

export type RankInfo = {
  current: Level;
  next: Level | null;
  progress: number;
  xpToNext: number;
};

export function getRankInfo(xp: number): RankInfo {
  let current = LEVELS[0];
  for (const lv of LEVELS) {
    if (xp >= lv.minXp) current = lv;
    else break;
  }
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = LEVELS[nextIdx] || null;
  const progress = next ? (xp - current.minXp) / (next.minXp - current.minXp) : 1;
  const xpToNext = next ? next.minXp - xp : 0;
  return { current, next, progress, xpToNext };
}

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  progress?: number;
  max?: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: '첫 발자국', desc: '첫 스탬프 획득', done: true },
  { id: 'baekje', title: '백제 답사가', desc: '백제 옛 도읍 2곳 방문', done: true },
  { id: 'streak7', title: '주말 답사자', desc: '7일 연속 방문', done: true },
  { id: 'quiz10', title: '역사 마스터', desc: '퀴즈 10문제 정답', done: false, progress: 7, max: 10 },
  { id: 'all-themes', title: '도감 완성가', desc: '한 테마 100% 완성', done: false, progress: 2, max: 7 },
  { id: 'gyeongi', title: '경기 답사가', desc: '경기도 5곳 방문', done: false, progress: 2, max: 5 },
];

export type RankingEntry = {
  rank: number;
  name: string;
  stamps: number;
  badge: string;
  me?: boolean;
};

export const RANKING: RankingEntry[] = [
  { rank: 1, name: '서원지기', stamps: 87, badge: '대보름' },
  { rank: 2, name: '낙관소년', stamps: 72, badge: '도감왕' },
  { rank: 3, name: '한지', stamps: 68, badge: '백제답사' },
  { rank: 14, name: '나', stamps: 6, badge: '첫 발자국', me: true },
];
