/** @type {import('eslint').Linter.Config} */
export const storybookVueConfig = {
  files: ['**/*.stories.ts', '**/*.stories.tsx'],
  rules: {
    'import/no-anonymous-default-export': 'off',
    '@vue/one-component-per-file': 'off',
  },
}
