import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { PLACES, STAMPED } from '../data/places.js';

export const stamps = new Hono();

// GET /api/stamped — 사용자가 모은 스탬프 ID 목록 (백워드 호환)
stamps.get('/', (c) => c.json(STAMPED));

// GET /api/stamps/recent?limit=6 — 표시용 메타 동봉
stamps.get(
  '/recent',
  zValidator(
    'query',
    z.object({
      limit: z.coerce.number().default(6),
    })
  ),
  (c) => {
    const { limit } = c.req.valid('query');
    const result = STAMPED.slice(0, limit).map((id) => {
      const p = PLACES.find((x) => x.id === id);
      return {
        id,
        glyph: p?.nameHanja?.[0] ?? '印',
        accent: p?.accent ?? '#E5563E',
      };
    });
    return c.json(result);
  }
);
