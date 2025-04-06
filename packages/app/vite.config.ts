import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import mediaMinmax from 'postcss-media-minmax'
import { defineConfig } from 'vite'
// import vueDevTools from 'vite-plugin-vue-devtools'
import { checker } from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    checker({
      vueTsc: true,
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@khsura/sui': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  build: {
    target: ['safari11', 'ios11'],
    lib: {
      entry: fileURLToPath(new URL('./index.ts', import.meta.url)),
      name: 'sUi',
      fileName: 's-ui',
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'vue',
        '@vueuse/components',
        '@vueuse/core',
        'dayjs',
        'lodash',
        'vue',
        'vue-i18n',
        'zod',
        'vue-router',
      ],
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), flexbugsFixes(), mediaMinmax()],
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `
          @use 'sass:map';
          @use 'sass:meta';
          @use 'sass:list';
          @use 'sass:string';
          @use '@khsura/sui/styles/helpers' as *;
        `,
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
})
