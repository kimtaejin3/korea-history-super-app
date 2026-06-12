// 클라이언트가 서버 API 응답을 타이핑할 때 쓰는 타입 정의.
// 실제 데이터는 모두 Postgres에서 옴 (server/src/data/places.ts → seed → DB).

export type Quiz = {
  q: string;
  options: string[];
  answer: number;
  hint: string;
};

export type Photo = {
  url: string;
  width?: number;
  height?: number;
  credit: string;
  sourceUrl?: string;
  license: 'cc-by-sa' | 'public-domain' | 'kogl-1' | 'kogl-2' | 'kogl-3' | 'kogl-4' | 'unknown';
  desc?: string;
};

export type Place = {
  id: string;
  name: string;
  region: string;
  era: string;
  distance: number;
  coords: { x: number; y: number };
  lat?: number;
  lon?: number;
  accent: string;
  tag: string;
  period: string;
  summary: string;
  story: string;
  visits: number;
  nearbyStamps: number;
  quiz: Quiz | null;
  /** 썸네일/사진 (출처 표기 필수) */
  photo?: Photo | null;
};
