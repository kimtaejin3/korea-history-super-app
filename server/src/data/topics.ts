/**
 * 주제(Topic) 시드 데이터.
 *
 * 테마(theme)와 다름:
 *  - theme: 답사 순서가 있는 코스
 *  - topic: 분류 기반 묶음 — 한 주제로 묶어 둘러볼 만한 장소들
 */

export type TopicSeed = {
  id: string;
  name: string;
  description: string;
  era: string | null;
  accent: string;
  glyph: string;
  placeIds: string[];
  sort: number;
};

export const TOPICS: TopicSeed[] = [
  {
    id: 'japanese-colonial-resistance',
    name: '일제강점기 항일의 자취',
    description: '독립 운동가들이 맞섰던 시간을 따라가는 길.',
    era: '근현대',
    accent: '#1F3A52',
    glyph: '獨',
    placeIds: [
      'dokrip-hall',
      'seodaemun-prison',
      'ahn-junggun-memorial',
      'baekbeom-kimgu-memorial',
      'hyochang-park',
    ],
    sort: 1,
  },
  {
    id: 'korean-seowon',
    name: '한국의 서원, 조선 학문의 길',
    description: '유교 성리학이 살아 숨쉬던 9곳의 서원.',
    era: '조선시대',
    accent: '#7A6450',
    glyph: '學',
    placeIds: ['sosu-seowon', 'dosan-seowon', 'byeongsan-seowon', 'oksan-seowon', 'dodong-seowon'],
    sort: 2,
  },
  {
    id: 'joseon-hanok-village',
    name: '조선의 한옥마을',
    description: '옛 사람들의 살림집과 마을이 그대로 남은 곳.',
    era: '조선시대',
    accent: '#8B6F47',
    glyph: '屋',
    placeIds: [
      'oeam-village',
      'andong-hahoe-village',
      'gyeongju-yangdong-village',
      'jeonju-hanok-village',
    ],
    sort: 3,
  },
];
