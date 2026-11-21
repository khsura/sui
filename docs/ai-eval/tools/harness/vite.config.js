import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// `sui-dist` is a symlink to <repo>/packages/app/dist (see docs/ai-eval/README.md).
const SUI_DIST = resolve(import.meta.dirname, 'sui-dist')

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^@khsura\/sui\/base\.css$/, replacement: `${SUI_DIST}/base.css` },
      { find: /^@khsura\/sui\/style\.css$/, replacement: `${SUI_DIST}/s-ui.css` },
      { find: /^@khsura\/sui$/, replacement: `${SUI_DIST}/s-ui.js` },
    ],
    // The built library imports these bare; resolve them once, from this app, so there is one Vue.
    dedupe: ['vue', '@vueuse/core', '@vueuse/components', 'dayjs', 'uuid', 'zod', 'vue-i18n', 'vue-router'],
  },
  server: { port: 5199, strictPort: true, fs: { allow: ['/'] } },
})
