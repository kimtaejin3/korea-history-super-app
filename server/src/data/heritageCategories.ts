/**
 * 국가유산 종목 코드표 (ccbaKdcd).
 * 태그 UI / 필터에서 사용. 색은 우리 디자인 토큰과 톤을 맞춤.
 *
 * 수집 대상 = 유물(artifacts) + 역사적 장소(historical places).
 *   - gis-heritage OpenAPI (국가지정): 11, 12, 13, 15, 18, 79
 *   - 위키 큐레이션 (시도지정 포함): 21, 23, 24, 31, 79
 * 제외: 16=천연기념물, 17=국가무형유산, 22=시도무형 (자연·무형)
 */

export type HeritageCategoryCode = 11 | 12 | 13 | 15 | 18 | 21 | 23 | 24 | 31 | 79;

export type HeritageCategory = {
  code: HeritageCategoryCode;
  /** 정식 명칭 */
  name: string;
  /** 짧은 라벨 (태그 칩에 적합) */
  short: string;
  /** 액센트 색 (태그 배경/텍스트) */
  color: string;
  /** 정렬 weight (1=상위 → 9=하위) */
  weight: number;
};

export const HERITAGE_CATEGORIES: Record<HeritageCategoryCode, HeritageCategory> = {
  // 국가지정 (gis-heritage OpenAPI)
  11: { code: 11, name: '국보', short: '국보', color: '#C8442A', weight: 1 },
  12: { code: 12, name: '보물', short: '보물', color: '#E07A30', weight: 2 },
  13: { code: 13, name: '사적', short: '사적', color: '#2C5C8C', weight: 3 },
  15: { code: 15, name: '명승', short: '명승', color: '#3A8C66', weight: 4 },
  18: { code: 18, name: '국가민속문화유산', short: '국가민속', color: '#7A6450', weight: 5 },
  79: { code: 79, name: '국가등록문화유산', short: '국가등록', color: '#4F6B5C', weight: 6 },

  // 시도지정 (위키 큐레이션)
  21: { code: 21, name: '시도유형문화재', short: '시도유형', color: '#8C6A55', weight: 7 },
  23: { code: 23, name: '시도기념물', short: '시도기념', color: '#8C6A55', weight: 7 },
  24: { code: 24, name: '시도민속문화재', short: '시도민속', color: '#8C6A55', weight: 7 },
  31: { code: 31, name: '문화재자료', short: '자료', color: '#86858A', weight: 8 },
};

/** 표시 순서대로 정렬된 카테고리 배열 (필터 칩 렌더링용) */
export const HERITAGE_CATEGORIES_ORDERED: HeritageCategory[] = Object.values(
  HERITAGE_CATEGORIES
).sort((a, b) => a.weight - b.weight);
