import rawOpenApi from '../../data/heritage.json';
import rawCurated from '../../data/heritage-curated.json';
import { HERITAGE_CATEGORIES, type HeritageCategoryCode } from '../data/heritageCategories';

/**
 * 통합 유산 레코드. 두 소스(OpenAPI + 큐레이션)를 같은 모양으로 노출.
 * 일부 필드는 소스에 따라 null/undefined.
 */
export type HeritageRecord = {
  /** 데이터 출처 */
  source: 'openapi' | 'curated';
  /** 종목 코드 */
  ccbaKdcd: HeritageCategoryCode;

  // 공통
  /** 명칭 (예: "강릉 선교장") */
  name: string;
  /** 시대 (예: "조선시대") */
  era: string | null;
  /** 광역 시도 (예: "경기도", "강원특별자치도") */
  region: string | null;

  // OpenAPI 전용
  admin?: string | null;
  designatedDate?: string | null;
  category?: string | null;
  cnX?: string | null;
  cnY?: string | null;
  designation?: string | null;
  classification?: string | null;
  sn?: string | null;
  location?: string | null;

  // 큐레이션 전용
  nameHanja?: string | null;
  designationType?: string | null;
  designationNo?: number | null;
  summary?: string | null;
  story?: string | null;
  coords?: { lat: number; lon: number } | null;
  wikipediaUrl?: string | null;
  theme?: string;
  photo?: HeritagePhoto | null;
};

export type HeritagePhoto = {
  url: string;
  width?: number;
  height?: number;
  credit: string;
  sourceUrl?: string;
  license: 'cc-by-sa' | 'public-domain' | 'kogl-1' | 'kogl-2' | 'kogl-3' | 'kogl-4' | 'unknown';
  desc?: string;
};

// ─── OpenAPI 레코드 정규화 ────────────────────────────────
type OpenApiRaw = {
  ccbaKdcd: number;
  name: string;
  admin: string | null;
  designatedDate: string | null;
  era: string | null;
  category: string | null;
  cnX: string | null;
  cnY: string | null;
  lat: number | null;
  lon: number | null;
  designation: string | null;
  classification: string | null;
  sn: string | null;
  location: string | null;
  photo?: HeritagePhoto | null;
};

const openApiRecords: HeritageRecord[] = (rawOpenApi as OpenApiRaw[]).map((r) => ({
  source: 'openapi' as const,
  ccbaKdcd: r.ccbaKdcd as HeritageCategoryCode,
  name: r.name,
  era: r.era,
  region: r.location, // 위치를 region으로 사용
  admin: r.admin,
  designatedDate: r.designatedDate,
  category: r.category,
  cnX: r.cnX,
  cnY: r.cnY,
  coords: r.lat != null && r.lon != null ? { lat: r.lat, lon: r.lon } : null,
  designation: r.designation,
  classification: r.classification,
  sn: r.sn,
  location: r.location,
  photo: r.photo,
}));

// ─── 큐레이션 레코드 정규화 ───────────────────────────────
type CuratedRaw = {
  source: string;
  ccbaKdcd: number;
  theme: string;
  name: string;
  nameHanja: string | null;
  era: string | null;
  region: string | null;
  designationType: string | null;
  designationNo: number | null;
  summary: string | null;
  story: string | null;
  coords: { lat: number; lon: number } | null;
  wikipediaUrl: string | null;
  photo?: HeritagePhoto | null;
};

const curatedRecords: HeritageRecord[] = (rawCurated as CuratedRaw[]).map((r) => ({
  source: 'curated' as const,
  ccbaKdcd: r.ccbaKdcd as HeritageCategoryCode,
  name: r.name,
  era: r.era,
  region: r.region,
  nameHanja: r.nameHanja,
  designationType: r.designationType,
  designationNo: r.designationNo,
  summary: r.summary,
  story: r.story,
  coords: r.coords,
  wikipediaUrl: r.wikipediaUrl,
  theme: r.theme,
  photo: r.photo,
}));

// ─── 통합 ─────────────────────────────────────────────────
/** 모든 수집 대상 유산 (OpenAPI + 큐레이션) */
export const HERITAGE: HeritageRecord[] = [...openApiRecords, ...curatedRecords];

/** OpenAPI만 */
export const HERITAGE_OPENAPI: HeritageRecord[] = openApiRecords;

/** 큐레이션(시도지정 포함)만 */
export const HERITAGE_CURATED: HeritageRecord[] = curatedRecords;

// ─── 그룹핑 (우산 ↔ 자식) ───────────────────────────────
/**
 * 자식 → 우산 매핑.
 * 룰: 어떤 레코드 X의 이름을 공백으로 잘라낸 prefix가 다른 레코드 이름과 정확히 일치하면 X는 자식.
 * 예: "순천 낙안읍성 이방댁"의 prefix "순천 낙안읍성"이 데이터에 존재 → 이방댁은 자식.
 */
const childToParent: Map<string, string> = (() => {
  const names = new Set(HERITAGE.map((r) => r.name));
  const map = new Map<string, string>();
  for (const r of HERITAGE) {
    const parts = r.name.split(' ');
    for (let i = parts.length - 1; i >= 1; i--) {
      const prefix = parts.slice(0, i).join(' ');
      if (names.has(prefix)) {
        map.set(r.name, prefix);
        break; // 가장 긴 prefix 우선
      }
    }
  }
  return map;
})();

/** 메인 리스트 — 우산(부모)만, 자식은 숨김 */
export const HERITAGE_COLLAPSED: HeritageRecord[] = HERITAGE.filter(
  (r) => !childToParent.has(r.name)
);

/** 우산 이름으로 자식 레코드들 조회 */
export function getGroupChildren(umbrellaName: string): HeritageRecord[] {
  return HERITAGE.filter((r) => childToParent.get(r.name) === umbrellaName);
}

/** 어떤 레코드가 우산이면 우산 이름, 자식이면 부모 우산 이름, 그 외엔 null */
export function getUmbrellaOf(record: HeritageRecord): string | null {
  return childToParent.get(record.name) || null;
}

/** 이 레코드가 우산(자식을 가진)인지 */
export function isUmbrella(record: HeritageRecord): boolean {
  return getGroupChildren(record.name).length > 0;
}

// ─── 헬퍼 ─────────────────────────────────────────────────
export function byCategory(code: HeritageCategoryCode): HeritageRecord[] {
  return HERITAGE.filter((h) => h.ccbaKdcd === code);
}

export function byRegion(regionKeyword: string): HeritageRecord[] {
  return HERITAGE.filter((h) => h.region?.includes(regionKeyword));
}

export function byEra(era: string): HeritageRecord[] {
  return HERITAGE.filter((h) => h.era === era);
}

export function searchByName(keyword: string): HeritageRecord[] {
  const lower = keyword.toLowerCase();
  return HERITAGE.filter((h) => h.name?.toLowerCase().includes(lower));
}

/** OpenAPI 좌표 (한국 좌표계) — WGS84 변환 별도 필요 */
export function getKoreanCoord(h: HeritageRecord): { x: number; y: number } | null {
  if (!h.cnX || !h.cnY) return null;
  const x = parseFloat(h.cnX.split(',')[0]!);
  const y = parseFloat(h.cnY.split(',')[0]!);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  return { x, y };
}

/** WGS84 좌표 (큐레이션 데이터만 보유) */
export function getWgsCoord(h: HeritageRecord): { lat: number; lon: number } | null {
  return h.coords || null;
}

export function getCategoryMeta(h: HeritageRecord) {
  return HERITAGE_CATEGORIES[h.ccbaKdcd];
}

export function formatDesignatedDate(date: string | null | undefined): string {
  if (!date || date.length !== 8) return '';
  return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
}

export function getCategoryCounts(): Record<HeritageCategoryCode, number> {
  const counts: Partial<Record<HeritageCategoryCode, number>> = {};
  for (const h of HERITAGE) {
    counts[h.ccbaKdcd] = (counts[h.ccbaKdcd] || 0) + 1;
  }
  return counts as Record<HeritageCategoryCode, number>;
}
