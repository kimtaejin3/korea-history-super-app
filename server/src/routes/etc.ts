import { Hono } from 'hono';
import { and, asc, count, eq } from 'drizzle-orm';
import { getDb, schema } from '../db/client.js';

export const etc = new Hono();
const USER_ID = 'me';

// 오늘의 역사
etc.get('/today', async (c) => {
  const db = getDb();
  const rows = await db.select().from(schema.todayEntry);
  return c.json(rows);
});

// 업적 — achievement + user의 진행도 join
etc.get('/achievements', async (c) => {
  const db = getDb();
  const rows = await db
    .select({
      id: schema.achievement.id,
      title: schema.achievement.title,
      description: schema.achievement.description,
      maxValue: schema.achievement.maxValue,
      progress: schema.userAchievement.progress,
      done: schema.userAchievement.done,
    })
    .from(schema.achievement)
    .leftJoin(
      schema.userAchievement,
      and(
        eq(schema.userAchievement.achievementId, schema.achievement.id),
        eq(schema.userAchievement.userId, USER_ID)
      )
    );

  return c.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      desc: r.description,
      done: r.done ?? false,
      progress: r.progress ?? undefined,
      max: r.maxValue ?? undefined,
    }))
  );
});

// 레벨 목록
etc.get('/levels', async (c) => {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.level)
    .orderBy(asc(schema.level.level));
  return c.json(
    rows.map((l) => ({
      level: l.level,
      name: l.name,
      hanja: l.hanja,
      minXp: l.minXp,
      color: l.color,
      desc: l.description,
      perks: l.perks,
    }))
  );
});

// 랭킹 — 멀티유저 트래킹 없으므로 mock 상위 + 내 스탬프 카운트 동봉
etc.get('/ranking', async (c) => {
  const db = getDb();
  const [stampsAgg] = await db
    .select({ value: count() })
    .from(schema.stamp)
    .where(eq(schema.stamp.userId, USER_ID));
  const myStamps = stampsAgg?.value ?? 0;

  return c.json([
    { rank: 1, name: '서원지기', stamps: 87, badge: '대보름' },
    { rank: 2, name: '낙관소년', stamps: 72, badge: '도감왕' },
    { rank: 3, name: '한지', stamps: 68, badge: '백제답사' },
    { rank: 14, name: '나', stamps: myStamps, badge: '첫 발자국', me: true },
  ]);
});
