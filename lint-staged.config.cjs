// Workspace-aware lint-staged config.
// Files arrive with paths relative to repo root (e.g. "client/app/foo.tsx").
// We cd into the matching workspace and strip the prefix so each tool runs
// from its own root with its own eslint.config.js / .prettierrc resolved.

function stripPrefix(files, prefix) {
  return files
    .filter((f) => f.startsWith(prefix))
    .map((f) => f.slice(prefix.length));
}

module.exports = {
  'client/**/*.{ts,tsx}': (files) => {
    const local = stripPrefix(files, 'client/');
    if (local.length === 0) return [];
    return [
      `sh -c 'cd client && ./node_modules/.bin/eslint --max-warnings=0 ${local.join(' ')}'`,
    ];
  },
  'server/**/*.ts': (files) => {
    const local = stripPrefix(files, 'server/');
    if (local.length === 0) return [];
    return [
      `sh -c 'cd server && ./node_modules/.bin/eslint --max-warnings=0 ${local.join(' ')}'`,
    ];
  },
  'client/**/*.{ts,tsx,js,jsx,json,md}': (files) => {
    const local = stripPrefix(files, 'client/');
    if (local.length === 0) return [];
    return [
      `sh -c 'cd client && ./node_modules/.bin/prettier --write ${local.join(' ')}'`,
    ];
  },
  'server/**/*.{ts,json,md}': (files) => {
    const local = stripPrefix(files, 'server/');
    if (local.length === 0) return [];
    return [
      `sh -c 'cd server && ./node_modules/.bin/prettier --write ${local.join(' ')}'`,
    ];
  },
};
