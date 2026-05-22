import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { PLACES, STAMPED } from '../data/places.js';
import { HERITAGE_COLLAPSED } from '../lib/heritage.js';
import { heritageToPlace } from '../lib/heritageAdapter.js';
import { distanceKm } from '../lib/geo.js';

// 헤리티지 → Place 어댑터. 큐레이션 mock + 헤리티지 전체.
// 좌표(lat/lon)가 있는 것만 포함. 거리는 사용자 위치 기준 런타임 계산.
const HERITAGE_PLACES = HERITAGE_COLLAPSED.filter((h) => h.coords).map(
  heritageToPlace
);
const ALL_PLACES = [...PLACES, ...HERITAGE_PLACES];

export const places = new Hono();

// 가까운 장소 — 서버측 거리 계산 + 정렬 + slice
// ⚠️ /:id 보다 먼저 등록. :id가 "nearby"를 잡으면 안 됨.
places.get(
  '/nearby',
  zValidator(
    'query',
    z.object({
      lat: z.coerce.number(),
      lon: z.coerce.number(),
      radius: z.coerce.number().default(20),
      limit: z.coerce.number().default(50),
      page: z.coerce.number().default(1),
      era: z.string().optional(), // "조선", "백제" 등. 없으면 전체.
    })
  ),
  (c) => {
    const { lat, lon, radius, limit, page, era } = c.req.valid('query');
    const filtered = ALL_PLACES.filter((p) => p.lat != null && p.lon != null)
      .filter((p) => !era || era === '전체' || p.era === era)
      .map((p) => ({
        ...p,
        distance: distanceKm({ lat, lon }, { lat: p.lat!, lon: p.lon! }),
      }))
      .filter((p) => p.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);
    return c.json({
      items,
      page,
      limit,
      total: filtered.length,
      hasMore: offset + items.length < filtered.length,
    });
  }
);

// 전체 장소 목록 (지도 화면용)
places.get('/', (c) => c.json(ALL_PLACES));

// 장소 상세
places.get('/:id', (c) => {
  const id = c.req.param('id');
  const place = ALL_PLACES.find((p) => p.id === id);
  if (!place) return c.json({ error: 'Not found' }, 404);
  return c.json(place);
});

// 스탬프된 ID 목록은 stamps 라우트에서 처리 — 여기서 export
export { STAMPED };
