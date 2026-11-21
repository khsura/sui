import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const appSuiApiPath = fileURLToPath(new URL('../app/dist/sui-api.json', import.meta.url))
const bundledSuiApiPath = fileURLToPath(new URL('./dist/sui-api.json', import.meta.url))

// Ships the latest @khsura/sui API beside dist/index.js as the fallback when a project has no install.
const bundleSuiApi = (): Plugin => ({
  name: 'bundle-sui-api',
  apply: 'build',
  closeBundle() {
    if (!existsSync(appSuiApiPath)) {
      this.warn(`${appSuiApiPath} not found; build packages/app first to bundle the fallback sui-api.json.`)

      return
    }

    copyFileSync(appSuiApiPath, bundledSuiApiPath)
  },
})

export default defineConfig({
  plugins: [bundleSuiApi()],
  build: {
    ssr: 'src/index.ts',
    outDir: 'dist',
    target: 'node20',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        banner: '#!/usr/bin/env node',
      },
    },
  },
  ssr: {
    noExternal: ['@khsura/shared'],
  },
})
