import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-undef': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^react-dom'], // React 관련
            ['^next'], // Next.js 관련
            ['^@?\\w'], // 외부 패키지
            ['^(@|components|lib|app)(/.*|$)'], // 내부 모듈
            ['^\\u0000'], // 사이드 이펙트
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // 상대 경로 (상위)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // 상대 경로 (같은 디렉토리)
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
