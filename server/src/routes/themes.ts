import { Hono } from 'hono';
import { THEMES } from '../data/themes.js';

export const themes = new Hono();

themes.get('/', (c) => c.json(THEMES));

themes.get('/:id', (c) => {
  const id = c.req.param('id');
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) return c.json({ error: 'Not found' }, 404);
  return c.json(theme);
});
