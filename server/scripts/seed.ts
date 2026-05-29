/**
 * DB seed 스크립트.
 *
 * 모든 정적 데이터(장소, 테마, 레벨, 업적, 오늘의 역사) + 기본 사용자/스탬프를
 * Postgres에 적재. 재실행 가능 (onConflict 처리).
 *
 * 실행: npm run db:seed
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema.js';
import { PLACES, STAMPED } from '../src/data/places.js';
import { THEMES } from '../src/data/themes.js';
import { LEVELS, ACHIEVEMENTS } from '../src/data/user.js';
import { TODAY_IN_HISTORY } from '../src/data/today.js';
import { HERITAGE_COLLAPSED } from '../src/lib/heritage.js';
import { heritageToPlace } from '../src/lib/heritageAdapter.js';

const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgresql://localhost:5432/korea_history';

const USER_ID = 'me';

const sql = postgres(DATABASE_URL, { max: 5 });
const db = drizzle(sql, { schema });

async function seedHeritage() {
  const heritageFromOpenApi = HERITAGE_COLLAPSED
    .filter((h) => h.coords)
    .map(heritageToPlace);
  const all = [...PLACES, ...heritageFromOpenApi];
  const seenIds = new Set<string>();
  const rows = all
    .filter((p) => {
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    })
    .map((p) => ({
      id: p.id,
      name: p.name,
      nameHanja: p.nameHanja,
      region: p.region,
      era: p.era,
      period: p.period,
      tag: p.tag,
      accent: p.accent,
      lat: p.lat ?? null,
      lon: p.lon ?? null,
      coords: p.coords,
      summary: p.summary,
      story: p.story,
      visits: p.visits,
      nearbyStamps: p.nearbyStamps,
      quiz: p.quiz,
      photo: p.photo ?? null,
      source: PLACES.find((c) => c.id === p.id) ? 'curated' : 'openapi',
    }));

  console.log(`[heritage] inserting ${rows.length} rows...`);
  // 배치로 나눠서 insert (드라이버 쿼리 파라미터 한도 고려)
  const BATCH = 200;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    await db
      .insert(schema.heritage)
      .values(batch)
      .onConflictDoUpdate({
        target: schema.heritage.id,
        set: {
          name: schema.heritage.name,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`[heritage] done.`);
}

async function seedThemes() {
  console.log(`[theme] inserting ${THEMES.length} rows...`);
  const rows = THEMES.map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    description: t.desc,
    cover: t.cover,
    color: t.color,
    glyph: t.glyph,
    totalPlaces: t.totalPlaces,
    rewardGoods: t.rewardGoods,
    badge: t.badge,
    placeIds: t.placeIds,
  }));
  await db
    .insert(schema.theme)
    .values(rows)
    .onConflictDoUpdate({
      target: schema.theme.id,
      set: {
        title: schema.theme.title,
        subtitle: schema.theme.subtitle,
        description: schema.theme.description,
        cover: schema.theme.cover,
        color: schema.theme.color,
        glyph: schema.theme.glyph,
        totalPlaces: schema.theme.totalPlaces,
        rewardGoods: schema.theme.rewardGoods,
        badge: schema.theme.badge,
        placeIds: schema.theme.placeIds,
      },
    });
  console.log(`[theme] done.`);
}

async function seedLevels() {
  console.log(`[level] inserting ${LEVELS.length} rows...`);
  const rows = LEVELS.map((lv) => ({
    level: lv.level,
    name: lv.name,
    hanja: lv.hanja,
    minXp: lv.minXp,
    color: lv.color,
    description: lv.desc,
    perks: lv.perks,
  }));
  await db
    .insert(schema.level)
    .values(rows)
    .onConflictDoUpdate({
      target: schema.level.level,
      set: {
        name: schema.level.name,
        hanja: schema.level.hanja,
        minXp: schema.level.minXp,
        color: schema.level.color,
        description: schema.level.description,
        perks: schema.level.perks,
      },
    });
  console.log(`[level] done.`);
}

async function seedUserAndStamps() {
  console.log(`[user] upserting default user '${USER_ID}'...`);
  await db
    .insert(schema.user)
    .values({
      id: USER_ID,
      nickname: '답사초보',
      daysActive: 142,
      quizCorrect: 7,
      themesCompleted: 0,
    })
    .onConflictDoUpdate({
      target: schema.user.id,
      set: {
        nickname: '답사초보',
        daysActive: 142,
        quizCorrect: 7,
        themesCompleted: 0,
      },
    });

  console.log(`[stamp] inserting ${STAMPED.length} stamps for '${USER_ID}'...`);
  for (const placeId of STAMPED) {
    await db
      .insert(schema.stamp)
      .values({ userId: USER_ID, placeId })
      .onConflictDoNothing();
  }
  console.log(`[stamp] done.`);
}

async function seedAchievements() {
  console.log(`[achievement] inserting ${ACHIEVEMENTS.length} rows...`);
  const achievementRows = ACHIEVEMENTS.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.desc,
    maxValue: a.max ?? null,
  }));
  await db
    .insert(schema.achievement)
    .values(achievementRows)
    .onConflictDoUpdate({
      target: schema.achievement.id,
      set: {
        title: schema.achievement.title,
        description: schema.achievement.description,
        maxValue: schema.achievement.maxValue,
      },
    });

  const userAchievementRows = ACHIEVEMENTS.map((a) => ({
    userId: USER_ID,
    achievementId: a.id,
    progress: a.progress ?? (a.done ? a.max ?? 1 : 0),
    done: a.done,
  }));
  await db
    .insert(schema.userAchievement)
    .values(userAchievementRows)
    .onConflictDoUpdate({
      target: [schema.userAchievement.userId, schema.userAchievement.achievementId],
      set: {
        progress: schema.userAchievement.progress,
        done: schema.userAchievement.done,
        updatedAt: new Date(),
      },
    });
  console.log(`[achievement] done.`);
}

async function seedToday() {
  console.log(`[today_entry] inserting ${TODAY_IN_HISTORY.length} rows...`);
  const rows = TODAY_IN_HISTORY.map((t, i) => ({
    id: `today-${i + 1}`,
    date: t.date,
    year: t.year,
    title: t.title,
    summary: t.summary,
    placeId: t.placeId,
    accent: t.accent,
    glyph: t.glyph,
  }));
  await db
    .insert(schema.todayEntry)
    .values(rows)
    .onConflictDoUpdate({
      target: schema.todayEntry.id,
      set: {
        date: schema.todayEntry.date,
        year: schema.todayEntry.year,
        title: schema.todayEntry.title,
        summary: schema.todayEntry.summary,
        placeId: schema.todayEntry.placeId,
        accent: schema.todayEntry.accent,
        glyph: schema.todayEntry.glyph,
      },
    });
  console.log(`[today_entry] done.`);
}

async function main() {
  const start = Date.now();
  await seedHeritage();
  await seedThemes();
  await seedLevels();
  await seedUserAndStamps();
  await seedAchievements();
  await seedToday();
  console.log(`\n✓ seed complete in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  await sql.end();
}

main().catch(async (e) => {
  console.error(e);
  await sql.end();
  process.exit(1);
});
