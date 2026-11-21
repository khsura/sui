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
  {
    // The published bundle must not import vue-router: apps without it fail to build. Even
    // `import { type X } from 'vue-router'` survives as a bare `import 'vue-router'` under
    // `verbatimModuleSyntax`. Detect the router at runtime (see services/routerLinkService.ts).
    files: ['**/*.ts', '**/*.vue'],
    ignores: ['tests/**', 'storybook/**', '.storybook/**', 'scripts/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vue-router',
              message: '@khsura/sui does not depend on vue-router. Use useRouterLinkService and the LinkLocation type.',
            },
          ],
        },
      ],
    },
  },
]
