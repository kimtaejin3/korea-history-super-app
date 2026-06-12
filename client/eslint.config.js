// Expo SDK 54 flat config + 추가 strict rules.
// AI 에이전트 산출물 가드용.
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const boundariesPlugin = require('eslint-plugin-boundaries');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'ios/*', 'android/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // 미사용 변수 차단 (TS strict와 중복이지만 lint 단계에서도 캐치)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // any 금지 (AI가 빠른 길로 any 쓰는 거 방지)
      '@typescript-eslint/no-explicit-any': 'error',

      // 사용 안 하는 expression 금지
      '@typescript-eslint/no-unused-expressions': 'error',

      // RN에선 require()가 표준 (Metro asset 로딩). expo 기본 설정의 warn을 끔.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    rules: {
      // 빈 catch 금지 (에러 삼키기 방지)
      'no-empty': ['error', { allowEmptyCatch: false }],

      // React Hooks 규칙
      'react-hooks/exhaustive-deps': 'warn',

      // console.log 경고 (에러는 너무 빡빡하니 warn)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // ─── FSD layer boundary ────────────────────────────────────
  // 의존 방향: shared ← entities ← features ← widgets ← app
  // 각 layer는 같은 layer + 더 아래(=더 generic) layer만 import 가능.
  // 위 방향으로 import하면 ESLint error.
  {
    files: ['{shared,entities,features,widgets,app}/**/*.{ts,tsx}'],
    plugins: { boundaries: boundariesPlugin },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        node: true,
      },
      'boundaries/elements': [
        // mode: 'folder' (default) — 한 패턴이 한 element를 지정.
        // entities/*는 entities/<slice> 폴더 단위 — 그 안의 모든 파일은 같은 slice element로 묶임.
        // 즉 entities/place/ui ↔ entities/place/model은 같은 element라 import 자유.
        // entities/place ↔ entities/user는 다른 element → boundaries 규칙 적용.
        { type: 'shared', pattern: 'shared' },
        { type: 'entities', pattern: 'entities/*' },
        { type: 'features', pattern: 'features/*' },
        { type: 'widgets', pattern: 'widgets/*' },
        { type: 'app', pattern: 'app' },
      ],
      'boundaries/ignore': ['node_modules/**', 'dist/**', '.expo/**', 'ios/**', 'android/**'],
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            // FSD strict: 같은 layer의 다른 slice는 직접 import 금지.
            // 같은 slice 안(예: place/ui ↔ place/model)은 plugin이 자동 허용.
            { from: 'shared', allow: ['shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'features', allow: ['shared', 'entities'] },
            { from: 'widgets', allow: ['shared', 'entities', 'features'] },
            // app은 composition root — 모든 widgets 조합해 페이지 만들어야 함.
            { from: 'app', allow: ['shared', 'entities', 'features', 'widgets', 'app'] },
          ],
        },
      ],
    },
  },
];
