// 클라이언트가 서버 API 응답을 타이핑할 때 쓰는 타입 정의.
// 실제 오늘의 역사 데이터는 모두 Postgres에서 옴.

export type TodayEntry = {
  date: string;
  year: number | null;
  title: string;
  summary: string;
  placeId: string | null;
  accent: string;
  glyph: string;
};
