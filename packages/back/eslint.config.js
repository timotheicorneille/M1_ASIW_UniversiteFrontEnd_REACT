import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const commonGlobals = {
  React: 'readonly',
  fetch: 'readonly',
  FormData: 'readonly',
  HTMLFormElement: 'readonly',
  HTMLTextAreaElement: 'readonly',
  URL: 'readonly',
  location: 'readonly',
  document: 'readonly',
  RequestInit: 'readonly',
  TextEncoder: 'readonly',
  crypto: 'readonly',
  console: 'readonly',
  process: 'readonly',
  Buffer: 'readonly',
  Request: 'readonly',
  Response: 'readonly',
};

export default [
  {
    ignores: ['node_modules', 'dist', 'build', '*.config.js'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: commonGlobals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-useless-catch': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
