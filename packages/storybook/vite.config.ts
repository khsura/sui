import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import config from '../app/vite.config'

export default mergeConfig(
  config,
  defineConfig({
    resolve: {
      alias: {
        '@khsura/sui': path.resolve(__dirname, '../app'),
        '@khsura/storybook': path.resolve(__dirname, './'),
      },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: `import { h, Fragment } from 'vue'`,
    },
  }),
)
