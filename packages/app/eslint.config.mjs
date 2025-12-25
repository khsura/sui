import storybook from 'eslint-plugin-storybook'
import config from '../shared/eslint.config.mjs'

export default [
  {
    // Inside your .eslintignore file
    ignores: ['!.storybook'],
  },
  ...storybook.configs['flat/recommended'],
  ...config,
]
