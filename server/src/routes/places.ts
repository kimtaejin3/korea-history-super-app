import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';
import { distanceKm } from '../lib/geo.js';

export const places = new Hono();

const PHOTO_PORT = 9000;
const PHOTO_BUCKET = 'heritage';

// coverPhoto가 있으면 MinIO URL로 변환, 없으면 위키 photo 그대로.
// 요청 Host에서 LAN IP를 뽑아 폰에서 직접 도달 가능한 URL 생성.
function resolvePhoto(row: typeof schema.heritage.$inferSelect, hostHeader: string | undefined) {
  const cover = row.coverPhoto;
  if (cover?.path) {
    const lanIp = hostHeader?.split(':')[0] ?? 'localhost';
    return {
      url: `http://${lanIp}:${PHOTO_PORT}/${PHOTO_BUCKET}/${cover.path}`,
      width: cover.width,
      height: cover.height,
      credit: cover.credit ?? 'curated',
      license: 'unknown' as const,
      desc: cover.desc,
    };
  }
  return row.photo;
}

// heritage row → 클라이언트 Place 응답. coverPhoto는 외부에 안 노출 (이미 photo로 해석됨).
function rowToPlace(
  row: typeof schema.heritage.$inferSelect,
  hostHeader: string | undefined,
  distance = 0
) {
  const { coverPhoto: _coverPhoto, ...rest } = row;
  return {
    ...rest,
    photo: resolvePhoto(row, hostHeader),
    distance,
  };
}

// 가까운 장소 — 좌표 있는 row만 + 거리 계산 + 정렬 + 페이징
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
      era: z.string().optional(),
    })
  ),
  async (c) => {
    const { lat, lon, radius, limit, page, era } = c.req.valid('query');
    const host = c.req.header('host');
    const db = getDb();
    const rows = await db.select().from(schema.heritage);

    const filtered = rows
      .filter((r) => r.lat != null && r.lon != null)
      .filter((r) => !era || era === '전체' || r.era === era)
      .map((r) => ({
        row: r,
        distance: distanceKm({ lat, lon }, { lat: r.lat!, lon: r.lon! }),
      }))
      .filter((x) => x.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit).map((x) => rowToPlace(x.row, host, x.distance));
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
places.get('/', async (c) => {
  const host = c.req.header('host');
  const db = getDb();
  const rows = await db.select().from(schema.heritage);
  return c.json(rows.map((r) => rowToPlace(r, host)));
});

// 장소 상세
places.get('/:id', async (c) => {
  const id = c.req.param('id');
  const host = c.req.header('host');
  const db = getDb();
  const [row] = await db.select().from(schema.heritage).where(eq(schema.heritage.id, id));
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(rowToPlace(row, host));
});
