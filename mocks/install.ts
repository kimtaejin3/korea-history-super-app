import { PLACES, STAMPED } from '../data/places';
import { THEMES } from '../data/themes';
import { ARTIFACTS } from '../data/artifacts';
import { FIGURES } from '../data/figures';
import { TODAY_IN_HISTORY } from '../data/today';
import { USER, ACHIEVEMENTS, RANKING, LEVELS, getRankInfo } from '../data/user';

type Handler = (params: Record<string, string>) => unknown;

const routes: Array<{ pattern: RegExp; handler: Handler }> = [];

function route(path: string, handler: Handler) {
  const re = new RegExp('^' + path.replace(/:([a-zA-Z]+)/g, '(?<$1>[^/]+)') + '$');
  routes.push({ pattern: re, handler });
}

route('/api/places', () => PLACES);
route('/api/places/:id', (params) => PLACES.find((p) => p.id === params.id) ?? null);
route('/api/stamped', () => STAMPED);

route('/api/themes', () => THEMES);
route('/api/themes/:id', (params) => THEMES.find((t) => t.id === params.id) ?? null);

route('/api/artifacts', () => ARTIFACTS);
route('/api/artifacts/:id', (params) => ARTIFACTS.find((a) => a.id === params.id) ?? null);

route('/api/figures', () => FIGURES);
route('/api/figures/:id', (params) => FIGURES.find((f) => f.id === params.id) ?? null);

route('/api/today', () => TODAY_IN_HISTORY);

route('/api/me', () => {
  const xp = USER.xp;
  return {
    nickname: USER.nickname,
    joinedAt: USER.joinedAt,
    daysActive: USER.daysActive,
    stamps: USER.stamps,
    quizCorrect: USER.quizCorrect,
    themesCompleted: USER.themesCompleted,
    xp,
    rank: getRankInfo(xp),
  };
});
route('/api/achievements', () => ACHIEVEMENTS);
route('/api/ranking', () => RANKING);
route('/api/levels', () => LEVELS);

let installed = false;

export function installMocks() {
  if (installed) return;
  installed = true;

  const originalFetch = global.fetch.bind(global);

  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    let pathname: string;
    try {
      pathname = new URL(url).pathname;
    } catch {
      return originalFetch(input, init);
    }

    for (const { pattern, handler } of routes) {
      const match = pathname.match(pattern);
      if (match) {
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
        const params = (match.groups ?? {}) as Record<string, string>;
        const body = handler(params);
        if (body == null) {
          return new Response(null, { status: 404 });
        }
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return originalFetch(input, init);
  }) as typeof fetch;
}
