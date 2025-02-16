import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['node_modules', 'server/build'],
  },
  ...compat.extends('plugin:prettier/recommended'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, 'off'])
        ),
        ...globals.es2021,
        ...globals.jest,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    files: ['**/*.js', '**/*.ts', '**/*.mjs'],

    rules: {
      'no-console': 'off',
      'prettier/prettier': 'error',
    },
  },
];
