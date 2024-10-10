// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import * as regexpPlugin from 'eslint-plugin-regexp';

export default tseslint.config(
  {
    ignores: ['.next', 'node_modules', '**/*.config.{ts,js,cjs}', '!**/eslint.config.js', 'coverage', 'public', 'dist', 'build', '.swc'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  comments.recommended,
  regexpPlugin.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    rules: {
      semi: 'error',
      quotes : [ 'error', 'single',
        {
          'avoidEscape': true,
          'allowTemplateLiterals': true
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn', // or "error"
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    }
  }
);
