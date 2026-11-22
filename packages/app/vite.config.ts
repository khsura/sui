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

// Browsers that support CSS logical properties (margin-inline, padding-inline-start, ...). With the JS target
// (safari11) the CSS minifier rewrites every logical property into `:not(:lang(ae, ar, ...))` rules, a selector list
// that Chromium does not parse, so Chrome and Edge dropped those margins and paddings (app bar title and toolbar
// buttons touching the edge, list indents).
export const cssBrowserTargets = ['chrome100', 'edge100', 'firefox100', 'safari15', 'ios15']

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    ...(isTest ? [] : [checker({ vueTsc: true, typescript: true })]),
  ],
  resolve: {
    alias: [
      { find: '@/app', replacement: fileURLToPath(new URL('./', import.meta.url)) },
      // Storybook recipes import from the published name so they stay copy-ready; resolve it to the source.
      { find: /^@khsura\/sui$/, replacement: fileURLToPath(new URL('./index.ts', import.meta.url)) },
    ],
  },
  build: {
    target: ['safari11', 'ios11'],
    cssTarget: cssBrowserTargets,
    lib: {
      entry: fileURLToPath(new URL('./index.ts', import.meta.url)),
      name: 'sUi',
      fileName: 's-ui',
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      // `vue-router` stays external so an accidental import can never bundle a second router copy, but
      // nothing may import it: it is not a dependency (ESLint forbids it; `yarn test:consumer` checks dist).
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
