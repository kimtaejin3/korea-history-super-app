import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, desc, inArray } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';

export const stamps = new Hono();
const USER_ID = 'me';

// GET /api/stamped — 사용자가 모은 스탬프 ID 목록
stamps.get('/', async (c) => {
  const db = getDb();
  const rows = await db
    .select({ placeId: schema.stamp.placeId })
    .from(schema.stamp)
    .where(eq(schema.stamp.userId, USER_ID));
  return c.json(rows.map((r) => r.placeId));
});

// GET /api/stamps/recent?limit=6 — 표시용 메타 동봉 (방문 최신순)
stamps.get(
  '/recent',
  zValidator(
    'query',
    z.object({
      limit: z.coerce.number().default(6),
    })
  ),
  async (c) => {
    const { limit } = c.req.valid('query');
    const db = getDb();
    const stampRows = await db
      .select({ placeId: schema.stamp.placeId })
      .from(schema.stamp)
      .where(eq(schema.stamp.userId, USER_ID))
      .orderBy(desc(schema.stamp.visitedAt))
      .limit(limit);

    if (stampRows.length === 0) return c.json([]);

    const placeIds = stampRows.map((s) => s.placeId);
    const heritageRows = await db
      .select({
        id: schema.heritage.id,
        name: schema.heritage.name,
        accent: schema.heritage.accent,
      })
      .from(schema.heritage)
      .where(inArray(schema.heritage.id, placeIds));

    const heritageById = new Map(heritageRows.map((h) => [h.id, h]));
    return c.json(
      stampRows.map((s) => {
        const h = heritageById.get(s.placeId);
        return {
          id: s.placeId,
          glyph: h?.name?.[0] ?? '印',
          accent: h?.accent ?? '#E5563E',
        };
      })
    );
  }
);
