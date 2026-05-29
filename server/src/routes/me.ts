import { Hono } from 'hono';
import { count, eq, asc } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';

export const me = new Hono();
const USER_ID = 'me';

// DB level row → 클라이언트 Level 응답 (description → desc).
function rowToLevel(l: typeof schema.level.$inferSelect) {
  return {
    level: l.level,
    name: l.name,
    hanja: l.hanja,
    minXp: l.minXp,
    color: l.color,
    desc: l.description,
    perks: l.perks,
  };
}

me.get('/', async (c) => {
  const db = getDb();
  const [user] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, USER_ID));
  if (!user) return c.json({ error: 'User not found' }, 404);

  const [stampsAgg] = await db
    .select({ value: count() })
    .from(schema.stamp)
    .where(eq(schema.stamp.userId, USER_ID));
  const stamps = stampsAgg?.value ?? 0;

  const xp = stamps * 10 + user.quizCorrect * 5 + user.themesCompleted * 50;

  const levelRows = await db
    .select()
    .from(schema.level)
    .orderBy(asc(schema.level.level));

  let current = levelRows[0];
  for (const lv of levelRows) {
    if (xp >= lv.minXp) current = lv;
    else break;
  }
  const nextIdx = levelRows.findIndex((l) => l.level === current.level) + 1;
  const next = levelRows[nextIdx] ?? null;
  const progress = next
    ? (xp - current.minXp) / (next.minXp - current.minXp)
    : 1;
  const xpToNext = next ? next.minXp - xp : 0;

  const joinedAt = `${user.joinedAt.getFullYear()}.${String(
    user.joinedAt.getMonth() + 1
  ).padStart(2, '0')}`;

  return c.json({
    nickname: user.nickname,
    joinedAt,
    daysActive: user.daysActive,
    stamps,
    quizCorrect: user.quizCorrect,
    themesCompleted: user.themesCompleted,
    xp,
    rank: {
      current: rowToLevel(current),
      next: next ? rowToLevel(next) : null,
      progress,
      xpToNext,
    },
  });
});
