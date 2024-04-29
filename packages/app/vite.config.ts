import path from 'path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import mediaMinmax from 'postcss-media-minmax'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [externalizeDeps(), tsconfigPaths(), vue()],
  build: {
    target: ['safari11', 'ios11'],
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'sUi',
      fileName: 's-ui',
    },
    rollupOptions: {
      external: ['vue', 'dayjs', 'vue-i18n'],
      output: {
        globals: {
          vue: 'Vue',
          dayjs: 'dayjs',
          'vue-i18n': 'vueI18n',
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), flexbugsFixes(), mediaMinmax()],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:map';
          @use 'sass:meta';
          @use 'sass:list';
          @use 'sass:string';
          @import '@sui/app/styles/helpers';
        `,
      },
    },
  },
})
