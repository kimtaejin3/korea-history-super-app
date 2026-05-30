/**
 * Drizzle DB 클라이언트. lazy singleton.
 *
 * 모든 라우트는 getDb()로 접근. seed.ts와 schema는 별개 경로.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// localhost 개발 fallback. 프로덕션은 반드시 DATABASE_URL 명시.
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://localhost:5432/korea_history';

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;
  const client = postgres(DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
  });
  _db = drizzle(client, { schema });
  return _db;
}

export { schema };
