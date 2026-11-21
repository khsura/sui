import storybook from 'eslint-plugin-storybook'
import config from '../shared/eslint.config.mjs'

export default [
  {
    // Inside your .eslintignore file
    ignores: ['!.storybook'],
  },
  ...storybook.configs['flat/recommended'],
  ...config,
  {
    // Recipes are copied into apps as is, so they keep the documented `#item.<column>` slot syntax
    // (Vue 3 reads the dots as part of the slot name, not as modifiers).
    files: ['storybook/recipes/**/*.vue'],
    rules: {
      'vue/valid-v-slot': ['error', { allowModifiers: true }],
    },
  },
]
