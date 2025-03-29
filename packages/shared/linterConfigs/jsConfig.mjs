/** @type {import('eslint').Linter.Config} */
export const jsConfig = {
  files: ['**/*.js', '**/*.mjs'],
  rules: {
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
  },
}
