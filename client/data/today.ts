export type TodayEntry = {
  date: string;
  year: number | null;
  title: string;
  summary: string;
  placeId: string | null;
  accent: string;
  glyph: string;
};

export const TODAY_IN_HISTORY: TodayEntry[] = [
  {
    date: '5월 15일',
    year: 1397,
    title: '세종대왕 탄생',
    summary:
      '훈민정음을 창제하고 측우기·앙부일구 등 과학기구를 발명한 조선 4대 임금이 한양 준수방에서 태어났다.',
    placeId: 'sejong-grave',
    accent: '#C8442A',
    glyph: '誕',
  },
  {
    date: '5월 7일',
    year: 1592,
    title: '옥포해전 첫 승전',
    summary:
      '이순신이 임진왜란 발발 후 첫 출전에서 거제 옥포에서 왜선 26척을 격파했다. 23전 23승의 시작.',
    placeId: 'tongyeong-jeseungdang',
    accent: '#1F3A52',
    glyph: '勝',
  },
  {
    date: '5월 첫 일요일',
    year: null,
    title: '종묘제례 봉행',
    summary:
      '조선 역대 왕과 왕비의 신주를 모신 종묘에서 매년 봉행되는 국가 의례. 유네스코 인류무형문화유산.',
    placeId: 'jongmyo',
    accent: '#5F7A6B',
    glyph: '祭',
  },
];
