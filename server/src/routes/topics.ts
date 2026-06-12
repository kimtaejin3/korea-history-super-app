import { Hono } from 'hono';
import { eq, asc } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';

export const topics = new Hono();

function rowToTopic(row: typeof schema.topic.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    era: row.era,
    accent: row.accent,
    glyph: row.glyph,
    placeIds: row.placeIds,
  };
}

// 전체 주제 목록 (sort 순)
topics.get('/', async (c) => {
  const db = getDb();
  const rows = await db.select().from(schema.topic).orderBy(asc(schema.topic.sort));
  return c.json(rows.map(rowToTopic));
});

// 주제 상세 — placeIds로 heritage 조인해서 같이 내려줌
topics.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = getDb();
  const [row] = await db.select().from(schema.topic).where(eq(schema.topic.id, id));
  if (!row) return c.json({ error: 'Not found' }, 404);
  return c.json(rowToTopic(row));
});
