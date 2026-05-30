// Expo SDK 54 flat config + 추가 strict rules.
// AI 에이전트 산출물 가드용.
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

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
];
