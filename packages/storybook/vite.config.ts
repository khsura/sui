import { defineConfig, mergeConfig } from 'vite'
import config from '../app/vite.config'

export default mergeConfig(
  config,
  defineConfig({
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: `import { h, Fragment } from 'vue'`,
    },
  }),
)
