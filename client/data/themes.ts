// 클라이언트가 서버 API 응답을 타이핑할 때 쓰는 타입 정의.
// 실제 테마 데이터는 모두 Postgres에서 옴.

export type Theme = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  /** 테마 카드/상세 hero 배경 단색 */
  cover: string;
  /** 액센트 (스탬프, 진행도, 텍스트 등) */
  color: string;
  glyph: string;
  placeIds: string[];
  totalPlaces: number;
  visited: number;
  rewardGoods: string;
  badge: string;
};
