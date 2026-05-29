/**
 * Drizzle ORM 스키마 — Postgres 기준.
 *
 * 모든 라우트가 이 스키마를 통해 DB에서 데이터를 읽음.
 * 변경 시 `npm run db:generate` → `db:migrate`.
 */

import {
  pgTable,
  text,
  integer,
  doublePrecision,
  boolean,
  timestamp,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ─── 장소 (Heritage / Place) ─────────────────────────────────
// UI의 Place 타입과 1:1 매칭. 큐레이션 + OpenAPI 데이터 통합.
export const heritage = pgTable(
  'heritage',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    nameHanja: text('name_hanja').notNull(),
    region: text('region').notNull(),
    era: text('era').notNull(),
    period: text('period').notNull(),
    tag: text('tag').notNull(),
    accent: text('accent').notNull(),
    lat: doublePrecision('lat'),
    lon: doublePrecision('lon'),
    coords: jsonb('coords').$type<{ x: number; y: number }>(),
    summary: text('summary').notNull(),
    story: text('story').notNull(),
    visits: integer('visits').notNull().default(0),
    nearbyStamps: integer('nearby_stamps').notNull().default(0),
    quiz: jsonb('quiz').$type<{
      q: string;
      options: string[];
      answer: number;
      hint: string;
    } | null>(),
    photo: jsonb('photo').$type<{
      url: string;
      width?: number;
      height?: number;
      credit: string;
      sourceUrl?: string;
      license: string;
      desc?: string;
    } | null>(),
    source: text('source').notNull().default('curated'), // 'curated' | 'openapi'
    // OpenAPI 메타 (선택)
    ccbaKdcd: integer('ccba_kdcd'),
    designation: text('designation'),
    designationDate: text('designation_date'),
    classification: text('classification'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    coordsIdx: index('heritage_coords_idx').on(table.lat, table.lon),
    regionIdx: index('heritage_region_idx').on(table.region),
  })
);

// ─── 테마 (답사 코스) ───────────────────────────────────────
export const theme = pgTable('theme', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  cover: text('cover').notNull(),
  color: text('color').notNull(),
  glyph: text('glyph').notNull(),
  totalPlaces: integer('total_places').notNull(),
  rewardGoods: text('reward_goods').notNull(),
  badge: text('badge').notNull(),
  placeIds: jsonb('place_ids').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── 등급/레벨 ──────────────────────────────────────────────
export const level = pgTable('level', {
  level: integer('level').primaryKey(),
  name: text('name').notNull(),
  hanja: text('hanja').notNull(),
  minXp: integer('min_xp').notNull(),
  color: text('color').notNull(),
  description: text('description').notNull(),
  perks: jsonb('perks').$type<string[]>().notNull(),
});

// ─── 사용자 ─────────────────────────────────────────────────
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  nickname: text('nickname').notNull(),
  email: text('email'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  daysActive: integer('days_active').notNull().default(0),
  quizCorrect: integer('quiz_correct').notNull().default(0),
  themesCompleted: integer('themes_completed').notNull().default(0),
});

// ─── 사용자의 스탬프 (방문 인증) ────────────────────────────
export const stamp = pgTable(
  'stamp',
  {
    userId: text('user_id').notNull(),
    placeId: text('place_id').notNull(),
    visitedAt: timestamp('visited_at').notNull().defaultNow(),
    quizCorrect: integer('quiz_correct'),
    photoUrl: text('photo_url'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.placeId] }),
    userIdx: index('stamp_user_idx').on(table.userId),
  })
);

// ─── 업적 ───────────────────────────────────────────────────
export const achievement = pgTable('achievement', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  maxValue: integer('max_value'), // null이면 binary (해당/미해당)
});

// 사용자별 업적 진행도
export const userAchievement = pgTable(
  'user_achievement',
  {
    userId: text('user_id').notNull(),
    achievementId: text('achievement_id').notNull(),
    progress: integer('progress').notNull().default(0),
    done: boolean('done').notNull().default(false),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.achievementId] }),
  })
);

// ─── 오늘의 역사 ────────────────────────────────────────────
export const todayEntry = pgTable('today_entry', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // "5월 15일"
  year: integer('year'),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  placeId: text('place_id'),
  accent: text('accent').notNull(),
  glyph: text('glyph').notNull(),
});

// 타입 추출
export type Heritage = typeof heritage.$inferSelect;
export type NewHeritage = typeof heritage.$inferInsert;
export type Theme = typeof theme.$inferSelect;
export type Level = typeof level.$inferSelect;
export type User = typeof user.$inferSelect;
export type Stamp = typeof stamp.$inferSelect;
export type Achievement = typeof achievement.$inferSelect;
export type UserAchievement = typeof userAchievement.$inferSelect;
export type TodayEntry = typeof todayEntry.$inferSelect;
