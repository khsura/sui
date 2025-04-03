import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import config from '../app/vite.config'

export default mergeConfig(
  config,
  defineConfig({
    resolve: {
      alias: {
        '@khsura/samples': path.resolve(__dirname, '../samples/src'),
        '@khsura/sui': path.resolve(__dirname, '../app'),
        '@khsura/shared': path.resolve(__dirname, '../shared'),
      },
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: `import { h, Fragment } from 'vue'`,
    },
  }),
)
