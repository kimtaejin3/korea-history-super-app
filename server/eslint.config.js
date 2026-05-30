// Server lint (Hono + Drizzle + TS).
// AI 에이전트 산출물 가드용.
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['dist/*', 'drizzle/*', 'node_modules/*'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      // 미사용 변수 차단
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // any 금지
      '@typescript-eslint/no-explicit-any': 'error',

      // 빈 catch 금지 (에러 삼키기 방지)
      'no-empty': ['error', { allowEmptyCatch: false }],

      // 사용 안 하는 expression 금지
      '@typescript-eslint/no-unused-expressions': 'error',

      // console — 서버에선 로깅 도구로 OK. warn/error는 항상 허용.
      'no-console': 'off',

      // non-null assertion (`!`)은 noUncheckedIndexedAccess와 함께 쓰는 정당한 패턴이
      // 많아서 lint 단에서는 허용. TS strict가 가드.
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
];
