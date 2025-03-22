import { dirname, join } from 'path'
import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import type { UserConfig } from 'vite'

const getAbsolutePath = (value: string): string => {
  return dirname(require.resolve(join(value, 'package.json')))
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

  docs: {
    autodocs: true,
  },
}

export default config
