import eslint from '@eslint/js'
import tslint from 'typescript-eslint'
import vueEslint from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import htmlParser from '@html-eslint/parser'
import htmlEslintPlugin from '@html-eslint/eslint-plugin'
import eslintPluginImport from 'eslint-plugin-import'

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

/** @type {import('eslint').Linter.FlatConfig[]} */
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
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    plugins: {
      import: eslintPluginImport,
    },
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
      import: eslintPluginImport,
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
