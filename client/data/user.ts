// 클라이언트가 서버 API 응답을 타이핑할 때 쓰는 타입 정의.
// 사용자/업적/랭킹 데이터는 모두 Postgres에서 옴.
//
// LEVELS const만 직접 import해서 쓰는 곳이 있음 (GatedButton에 정적으로 등급 전달):
//   - app/(tabs)/themes.tsx
//   - app/place/[id].tsx
// 향후 api.levels() 결과로 대체하면 이 const도 제거 가능.

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
