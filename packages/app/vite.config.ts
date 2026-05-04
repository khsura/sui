/// <reference types="vitest/config" />
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import mediaMinmax from 'postcss-media-minmax'
import { defineConfig } from 'vite'
// import vueDevTools from 'vite-plugin-vue-devtools'
import { checker } from 'vite-plugin-checker'

const isTest = !!process.env.VITEST

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    ...(isTest ? [] : [checker({ vueTsc: true, typescript: true })]),
  ],
  resolve: {
    alias: {
      '@/app': fileURLToPath(new URL('./', import.meta.url)),
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
      external: ['vue', '@vueuse/components', '@vueuse/core', 'dayjs', 'vue', 'vue-i18n', 'zod', 'vue-router', 'uuid'],
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
          @use '@/app/styles/helpers' as *;
        `,
      },
    },
  },
})
