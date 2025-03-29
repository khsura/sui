import htmlEslintPlugin from '@html-eslint/eslint-plugin'
import * as htmlParser from '@html-eslint/parser'

/** @type {import('eslint').Linter.Config} */
export const htmlConfig = {
  files: ['*.html'],
  languageOptions: {
    parser: htmlParser,
  },
  plugins: { html: htmlEslintPlugin },
  rules: {
    'vue/comment-directive': 'off',
  },
}
