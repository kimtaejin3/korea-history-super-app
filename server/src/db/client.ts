/**
 * Drizzle DB 클라이언트.
 *
 * 현재는 lazy init. DATABASE_URL 환경변수가 있으면 Postgres 연결 시도.
 * 없으면 null 반환 — 라우트에서 JSON 데이터로 fallback.
 *
 * 향후 DB 마이그레이션 완료되면 모든 라우트가 db를 사용하도록 전환.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;
  if (!DATABASE_URL) {
    console.warn('[db] DATABASE_URL not set — DB features disabled, using in-memory data');
    return null;
  }
  const client = postgres(DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
  });
  _db = drizzle(client, { schema });
  return _db;
}

export { schema };
