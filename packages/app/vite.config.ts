import path from 'path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import mediaMinmax from 'postcss-media-minmax'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@khsura/sui': __dirname,
    },
  },
  build: {
    target: ['safari11', 'ios11'],
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'sUi',
      fileName: 's-ui',
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['vue', '@vueuse/components', '@vueuse/core', 'dayjs', 'lodash', 'vue', 'vue-i18n', 'zod'],
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
