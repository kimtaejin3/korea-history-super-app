import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { places } from './routes/places.js';
import { themes } from './routes/themes.js';
import { stamps } from './routes/stamps.js';
import { etc } from './routes/etc.js';
import { me } from './routes/me.js';

const app = new Hono();

app.use(logger());
app.use(
  '/api/*',
  cors({
    origin: '*', // 개발용. 프로덕션에선 화이트리스트로 제한.
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.get('/', (c) =>
  c.json({
    name: 'korea-history-server',
    version: '0.1.0',
    docs: '/api',
  })
);

// 라우트 마운트 — 순서 주의: 구체적 path가 먼저
app.route('/api/places', places);
app.route('/api/themes', themes);
app.route('/api/stamps', stamps);
app.route('/api/stamped', stamps); // 백워드 호환 (기존 /api/stamped 경로)
app.route('/api', etc); // /artifacts, /figures, /today, /achievements, /ranking, /levels
app.route('/api/me', me);

const port = parseInt(process.env.PORT || '3000', 10);
console.log(`▶ korea-history-server listening on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
