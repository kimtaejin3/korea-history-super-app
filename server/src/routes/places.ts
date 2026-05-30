import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';
import { distanceKm } from '../lib/geo.js';

export const places = new Hono();

// heritage 테이블 row → 클라이언트 Place 응답.
// 컬럼명이 대부분 일치하므로 거리만 덧붙임.
function rowToPlace(row: typeof schema.heritage.$inferSelect, distance = 0) {
  return { ...row, distance };
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
    const db = getDb();
    const rows = await db.select().from(schema.heritage);

    const filtered = rows
      .filter((r) => r.lat != null && r.lon != null)
      .filter((r) => !era || era === '전체' || r.era === era)
      .map((r) => ({
        ...r,
        distance: distanceKm({ lat, lon }, { lat: r.lat!, lon: r.lon! }),
      }))
      .filter((r) => r.distance <= radius)
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
places.get('/', async (c) => {
  const db = getDb();
  const rows = await db.select().from(schema.heritage);
  return c.json(rows.map((r) => rowToPlace(r)));
});

// 장소 상세
places.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = getDb();
  const [row] = await db.select().from(schema.heritage).where(eq(schema.heritage.id, id));
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(rowToPlace(row));
});
