import { Hono } from 'hono';
import { ARTIFACTS } from '../data/artifacts.js';
import { FIGURES } from '../data/figures.js';
import { TODAY_IN_HISTORY } from '../data/today.js';
import { ACHIEVEMENTS, RANKING, LEVELS } from '../data/user.js';

export const etc = new Hono();

// Artifacts
etc.get('/artifacts', (c) => c.json(ARTIFACTS));
etc.get('/artifacts/:id', (c) => {
  const id = c.req.param('id');
  const a = ARTIFACTS.find((x) => x.id === id);
  if (!a) return c.json({ error: 'Not found' }, 404);
  return c.json(a);
});

// Figures
etc.get('/figures', (c) => c.json(FIGURES));
etc.get('/figures/:id', (c) => {
  const id = c.req.param('id');
  const f = FIGURES.find((x) => x.id === id);
  if (!f) return c.json({ error: 'Not found' }, 404);
  return c.json(f);
});

// Today in History
etc.get('/today', (c) => c.json(TODAY_IN_HISTORY));

// Achievements / Ranking / Levels (사용자 메타)
etc.get('/achievements', (c) => c.json(ACHIEVEMENTS));
etc.get('/ranking', (c) => c.json(RANKING));
etc.get('/levels', (c) => c.json(LEVELS));
