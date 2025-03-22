import config from '../shared/eslint.config.mjs'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    files: ['**/*.stories.ts', '**/*.stories.tsx'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
]
