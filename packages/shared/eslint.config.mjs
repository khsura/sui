import eslint from '@eslint/js'
import htmlEslintPlugin from '@html-eslint/eslint-plugin'
import * as htmlParser from '@html-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import * as tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier/recommended'
import vueEslint from 'eslint-plugin-vue'
import globals from 'globals'
import tslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const jsRules = {
  'no-undef': 'off',
  radix: 'error',
  curly: 'error',
  'comma-dangle': 'off',
  'require-await': 'error',
  'no-var': ['error'],
  'arrow-body-style': ['error', 'always'],
  'object-shorthand': ['warn', 'always'],
  'padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: 'block-like', next: '*' },
    { blankLine: 'always', prev: 'multiline-const', next: '*' },
    { blankLine: 'always', prev: 'import', next: '*' },
    { blankLine: 'any', prev: 'import', next: 'import' },
    {
      blankLine: 'always',
      prev: ['singleline-const', 'singleline-let', 'singleline-var'],
      next: '*',
    },
    {
      blankLine: 'never',
      prev: ['singleline-const', 'singleline-let', 'singleline-var'],
      next: ['singleline-const', 'singleline-let', 'singleline-var'],
    },
  ],
  'import/order': ['error'],
}

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', 'public', 'storybook-static', '@types'],
  },
  eslint.configs.recommended,
  ...tslint.configs.recommended,
  ...vueEslint.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: {
          extensions: ['.js', '.ts', '.vue'],
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/extensions': ['.js', '.mjs', '.ts', '.tsx', '.vue'],
      alias: {
        map: [
          ['@khsura/sui', '../app'],
          ['@khsura/shared', '../shared'],
          ['@khsura/storybook', '../storybook'],
        ],
        extensions: ['.vue', '.js', '.ts'],
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      'import/no-unresolved': ['off'],
      'import/named': ['off'],
      'import/default': ['off'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: jsRules,
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: true,
        parser: tsParser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      ...jsRules,
      // 'css/color-hex-style': ['error', 'RRGGBB'],
      // 'css/property-casing': ['error', 'camelCase'],
      // 'css/number-leading-zero': ['error', 'always'],
      // 'css/named-color': ['error', 'never'],
      // 'css/no-length-zero-unit': ['error'],
      // 'css/prefer-reduce-shorthand-property-box-values': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-non-null-assertion': ['error'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': ['error', { ignoreConditionalTests: true }],
      '@typescript-eslint/prefer-ts-expect-error': ['error'],
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-dynamic-delete': ['error'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      'vue/no-unused-properties': ['warn'],
      'vue/multi-word-component-names': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: true,
          ignores: [],
        },
      ],
    },
  },
  {
    // files: ['**/*.stories.ts', '**/*.stories.tsx'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      '@vue/one-component-per-file': 'off',
    },
  },
  prettier,
  {
    files: ['*.html'],
    languageOptions: {
      parser: htmlParser,
    },
    plugins: { html: htmlEslintPlugin },
    rules: {
      'vue/comment-directive': 'off',
    },
  },
]
