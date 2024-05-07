import path from 'path'
import { defineConfig, mergeConfig } from 'vite'
import config from '../app/vite.config'

export default mergeConfig(
  config,
  defineConfig({
    resolve: {
      alias: {
        '@sui/app': path.resolve(__dirname, '../app'),
        '@sui/storybook': path.resolve(__dirname, './'),
      },
    },
  }),
)
