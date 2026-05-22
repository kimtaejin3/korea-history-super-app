import { Hono } from 'hono';
import { USER, getRankInfo } from '../data/user.js';

export const me = new Hono();

me.get('/', (c) => {
  const xp = USER.xp;
  return c.json({
    nickname: USER.nickname,
    joinedAt: USER.joinedAt,
    daysActive: USER.daysActive,
    stamps: USER.stamps,
    quizCorrect: USER.quizCorrect,
    themesCompleted: USER.themesCompleted,
    xp,
    rank: getRankInfo(xp),
  });
});
