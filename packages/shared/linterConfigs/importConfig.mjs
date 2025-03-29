import importPlugin from 'eslint-plugin-import'

/** @type {import('eslint').Linter.Config} */
export const importConfig = {
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
  },
  rules: {
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
}
