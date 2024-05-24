import { dirname, join } from 'node:path'
import { mergeConfig } from 'vite'
import type { StorybookConfig } from '@storybook/vue3-vite'
import type { UserConfig } from 'vite'

const getAbsolutePath = <T extends string>(value: T): T => {
  return dirname(require.resolve(join(value, 'package.json'))) as T
}

const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('storybook-dark-mode'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },

  viteFinal: (previousConfig: UserConfig) => {
    const additionalConfig: UserConfig = {
      build: {
        sourcemap: 'inline',
      },
      optimizeDeps: {
        include: ['@storybook/theming', '@storybook/manager-api', 'storybook-dark-mode'],
      },
    }

    return mergeConfig(previousConfig, additionalConfig)
  },
}

export default config
