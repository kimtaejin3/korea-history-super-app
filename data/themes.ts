export type Theme = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  cover: [string, string];
  color: string;
  glyph: string;
  placeIds: string[];
  totalPlaces: number;
  visited: number;
  rewardGoods: string;
  badge: string;
};

export const THEMES: Theme[] = [
  {
    id: 'daedongbeop',
    title: '대동법의 길',
    subtitle: '김육과 백성의 길',
    desc: '조선 후기 가장 큰 세제 개혁, 대동법의 발자취를 따라 걷는 충청·경기 6곳.',
    cover: ['#C8442A', '#8B2A1A'],
    color: '#C8442A',
    glyph: '法',
    placeIds: ['daedongbeop-bi', 'paengseong-gaeksa'],
    totalPlaces: 6,
    visited: 1,
    rewardGoods: '대동법 한지 엽서 세트',
    badge: '경세가의 길',
  },
  {
    id: 'chungcheong-gaeksa',
    title: '충청 객사 투어',
    subtitle: '관아의 풍경',
    desc: '조선 행정의 거점이었던 충청도 객사 8곳을 잇는 답사 코스.',
    cover: ['#5F7A6B', '#3D5249'],
    color: '#5F7A6B',
    glyph: '舍',
    placeIds: ['paengseong-gaeksa'],
    totalPlaces: 8,
    visited: 1,
    rewardGoods: '객사 디자인 텀블러',
    badge: '관아 답사가',
  },
  {
    id: 'yi-sunsin',
    title: '이순신 발자취',
    subtitle: '바다의 길',
    desc: '아산 현충사부터 통영, 진도, 남해까지. 충무공의 23전 23승을 따라가는 해상 루트.',
    cover: ['#1F4A6B', '#0E2A42'],
    color: '#1F4A6B',
    glyph: '忠',
    placeIds: ['hyeonchungsa'],
    totalPlaces: 9,
    visited: 1,
    rewardGoods: '난중일기 미니어처 + 거북선 뱃지',
    badge: '충무공의 길',
  },
  {
    id: 'jeongjo',
    title: '정조의 길',
    subtitle: '효심과 개혁',
    desc: '정조가 만든 신도시 화성과 능행차 경로를 따라가는 효의 길.',
    cover: ['#C8442A', '#6B2010'],
    color: '#C8442A',
    glyph: '正',
    placeIds: ['hwaseong'],
    totalPlaces: 5,
    visited: 1,
    rewardGoods: '화성 능행도 한정 포스터',
    badge: '능행의 길',
  },
];
