import type { Place } from '../data/places';
import type { HeritageRecord } from './heritage';
import { HERITAGE_CATEGORIES } from '../data/heritageCategories';
import { HERITAGE_STORIES } from '../data/heritageStories';

/**
 * HeritageRecord → Place 변환.
 *
 * WGS84 좌표(lat/lon)가 있으면 Place에 그대로 부여.
 * distance는 0(기본값) — 실제 거리는 사용자 위치 알게 된 후 런타임에 lib/geo.ts의 distanceKm으로 계산.
 */

// 스타일라이즈된 한반도 좌표 (지도 핀용 0~100 비율) — 실 위경도와 별개의 미니맵 좌표
const REGION_COORDS: Record<string, { x: number; y: number }> = {
  '서울': { x: 40, y: 18 },
  '경기': { x: 38, y: 20 },
  '인천': { x: 33, y: 20 },
  '강원': { x: 52, y: 18 },
  '충청남도': { x: 35, y: 32 },
  '대전': { x: 40, y: 35 },
  '세종': { x: 39, y: 33 },
  '충청북도': { x: 45, y: 30 },
  '전라북도': { x: 38, y: 52 },
  '전북': { x: 38, y: 52 },
  '전라남도': { x: 36, y: 65 },
  '경상북도': { x: 56, y: 38 },
  '경상남도': { x: 56, y: 58 },
  '대구': { x: 53, y: 42 },
  '부산': { x: 60, y: 60 },
  '울산': { x: 62, y: 50 },
  '광주': { x: 35, y: 60 },
  '제주': { x: 32, y: 92 },
};

function rand(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function stylizedCoords(region: string | null, seed: number): { x: number; y: number } {
  if (!region) return { x: 50, y: 50 };
  for (const [k, c] of Object.entries(REGION_COORDS)) {
    if (region.includes(k)) {
      const jitterX = (rand(seed) - 0.5) * 6;
      const jitterY = (rand(seed + 1) - 0.5) * 6;
      return { x: Math.round(c.x + jitterX), y: Math.round(c.y + jitterY) };
    }
  }
  return { x: 50, y: 50 };
}

function formatPeriod(date: string | null | undefined, era: string | null | undefined): string {
  if (date && date.length === 8) {
    return `지정 ${date.slice(0, 4)}`;
  }
  return era || '';
}

function ensureNameHanja(h: HeritageRecord): string {
  if (h.nameHanja) return h.nameHanja;
  return '';
}

export function heritageToPlace(h: HeritageRecord): Place {
  const meta = HERITAGE_CATEGORIES[h.ccbaKdcd];
  const id =
    h.source === 'curated'
      ? `h-c-${h.name.replace(/\s+/g, '-')}`
      : `h-${h.ccbaKdcd}-${h.sn || h.name.replace(/\s+/g, '-')}`;
  const seed = hashStr(id);
  const region = h.region || h.location || '';
  const curatedStory = HERITAGE_STORIES[h.name];

  return {
    id,
    name: h.name,
    nameHanja: ensureNameHanja(h),
    region,
    era: h.era || '조선시대',
    distance: 0, // 런타임에 사용자 위치로부터 계산됨
    coords: stylizedCoords(region, seed),
    lat: h.coords?.lat,
    lon: h.coords?.lon,
    accent: meta?.color || '#86858A',
    tag: meta?.short || '문화유산',
    period: formatPeriod(h.designatedDate, h.era),
    summary:
      curatedStory?.summary ||
      h.summary ||
      h.classification?.replace(/\s*\/\s*/g, ' · ') ||
      `${meta?.name || ''} 지정 유산`,
    story: curatedStory?.story || h.story || h.summary || '',
    visits: 0,
    nearbyStamps: 0,
    quiz: curatedStory?.quiz ?? null,
  };
}
