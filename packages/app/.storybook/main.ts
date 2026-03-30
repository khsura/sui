import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

import type { StorybookConfig } from '@storybook/vue3-vite'
// import { mergeConfig, type UserConfig } from 'vite'

const getAbsolutePath = (value: string) => {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}

export default {
  stories: ['../storybook/stories/**/*.stories.ts'],
  addons: [
    // 'storybook-dark-mode',
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
} satisfies StorybookConfig
