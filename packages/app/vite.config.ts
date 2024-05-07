import path from 'path'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import mediaMinmax from 'postcss-media-minmax'
import { defineConfig } from 'vite'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [externalizeDeps(), vue(), vueJsx()],
  resolve: {
    alias: {
      '@sui/app': __dirname,
    },
  },
  build: {
    target: ['safari11', 'ios11'],
    lib: {
      entry: path.resolve(__dirname, './index.ts'),
      name: 'sUi',
      fileName: 's-ui',
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
          @import './styles/helpers';
        `,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
    },
  },
})
