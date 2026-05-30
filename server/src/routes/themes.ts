import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';

export const themes = new Hono();
const USER_ID = 'me';

// DB row → 클라이언트 Theme 응답.
// description → desc 매핑 + visited (사용자 스탬프 기반 계산).
function rowToTheme(row: typeof schema.theme.$inferSelect, stampedSet: Set<string>) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    desc: row.description,
    cover: row.cover,
    color: row.color,
    glyph: row.glyph,
    totalPlaces: row.totalPlaces,
    visited: row.placeIds.filter((id) => stampedSet.has(id)).length,
    rewardGoods: row.rewardGoods,
    badge: row.badge,
    placeIds: row.placeIds,
  };
}

async function getStampedSet(): Promise<Set<string>> {
  const db = getDb();
  const stamps = await db
    .select({ placeId: schema.stamp.placeId })
    .from(schema.stamp)
    .where(eq(schema.stamp.userId, USER_ID));
  return new Set(stamps.map((s) => s.placeId));
}

themes.get('/', async (c) => {
  const db = getDb();
  const [rows, stampedSet] = await Promise.all([db.select().from(schema.theme), getStampedSet()]);
  return c.json(rows.map((r) => rowToTheme(r, stampedSet)));
});

themes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = getDb();
  const [row] = await db.select().from(schema.theme).where(eq(schema.theme.id, id));
  if (!row) return c.json({ error: 'Not found' }, 404);
  const stampedSet = await getStampedSet();
  return c.json(rowToTheme(row, stampedSet));
});
