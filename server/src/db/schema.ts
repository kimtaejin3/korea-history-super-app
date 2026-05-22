/**
 * Drizzle ORM 스키마 — Postgres 기준.
 *
 * 현재는 정의만. 실제 데이터는 server/data/*.json과 server/src/data/*.ts에서 읽음.
 * DB 마이그레이션 시점에 `npm run db:generate` → `db:migrate` → `db:seed`로 활성화.
 */

import {
  pgTable,
  text,
  integer,
  doublePrecision,
  timestamp,
  jsonb,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ─── 유산 (Heritage) — gis-heritage OpenAPI 원본 데이터 ─────────
export const heritage = pgTable(
  'heritage',
  {
    id: text('id').primaryKey(), // ccbaKdcd + sn 합성 키 또는 자체 ID
    ccbaKdcd: integer('ccba_kdcd').notNull(), // 종목 코드 (11=국보, 12=보물, ...)
    name: text('name').notNull(),
    nameHanja: text('name_hanja'),
    era: text('era'),
    region: text('region'),
    location: text('location'), // 시군구까지
    admin: text('admin'),
    designation: text('designation'), // "제5호" 등
    designationDate: text('designation_date'), // YYYYMMDD
    classification: text('classification'), // 분류 path
    cnX: text('cn_x'), // 한국 좌표계 (참고용)
    cnY: text('cn_y'),
    lat: doublePrecision('lat'), // WGS84
    lon: doublePrecision('lon'),
    source: text('source').notNull().default('openapi'), // 'openapi' | 'curated'
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    ccbaKdcdIdx: index('heritage_ccba_kdcd_idx').on(table.ccbaKdcd),
    locationIdx: index('heritage_location_idx').on(table.location),
    coordsIdx: index('heritage_coords_idx').on(table.lat, table.lon),
  })
);

// ─── 큐레이션 콘텐츠 — 헤리티지에 스토리/퀴즈 추가 ──────────
export const heritageStory = pgTable('heritage_story', {
  heritageName: text('heritage_name').primaryKey(), // heritage.name과 매칭
  summary: text('summary').notNull(),
  story: text('story').notNull(),
  quizQuestion: text('quiz_question'),
  quizOptions: jsonb('quiz_options').$type<string[]>(),
  quizAnswer: integer('quiz_answer'),
  quizHint: text('quiz_hint'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

// ─── 유물 ───────────────────────────────────────────────────
export const artifact = pgTable('artifact', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameHanja: text('name_hanja'),
  designation: text('designation'),
  category: text('category'),
  era: text('era'),
  summary: text('summary'),
  story: text('story'),
  placeId: text('place_id'),
  figureId: text('figure_id'),
  accent: text('accent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── 인물 ───────────────────────────────────────────────────
export const figure = pgTable('figure', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameHanja: text('name_hanja'),
  years: text('years'),
  title: text('title'),
  summary: text('summary'),
  story: text('story'),
  accent: text('accent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── 사용자 ─────────────────────────────────────────────────
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  nickname: text('nickname').notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  email: text('email'),
  // 인증 정보는 별도 테이블 (소셜 로그인 시) 또는 Supabase Auth 위임
});

// ─── 사용자의 스탬프 (방문 인증) ────────────────────────────
export const stamp = pgTable(
  'stamp',
  {
    userId: text('user_id').notNull(),
    placeId: text('place_id').notNull(),
    visitedAt: timestamp('visited_at').notNull().defaultNow(),
    quizCorrect: integer('quiz_correct'), // 0/1 또는 null (퀴즈 없음)
    photoUrl: text('photo_url'),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.placeId] }),
    userIdx: index('stamp_user_idx').on(table.userId),
  })
);

// 타입 추출
export type Heritage = typeof heritage.$inferSelect;
export type NewHeritage = typeof heritage.$inferInsert;
export type Theme = typeof theme.$inferSelect;
export type Artifact = typeof artifact.$inferSelect;
export type Figure = typeof figure.$inferSelect;
export type User = typeof user.$inferSelect;
export type Stamp = typeof stamp.$inferSelect;
