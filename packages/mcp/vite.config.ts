import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import { guideSourceFiles } from './src/configs'

const appSuiApiPath = fileURLToPath(new URL('../app/dist/sui-api.json', import.meta.url))
const bundledSuiApiPath = fileURLToPath(new URL('./dist/sui-api.json', import.meta.url))
const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
const bundledGuidesDir = fileURLToPath(new URL('./dist/guides', import.meta.url))

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

// Copies every markdown file the guide topics map to into dist/guides, so get_guide serves the docs as built.
const bundleGuides = (): Plugin => ({
  name: 'bundle-guides',
  apply: 'build',
  closeBundle() {
    guideSourceFiles.forEach((sourceFile) => {
      const sourcePath = join(repoRoot, sourceFile)

      if (!existsSync(sourcePath)) {
        this.error(`Guide source ${sourcePath} not found; update src/configs/guideTopics.ts.`)
      }

      const targetPath = join(bundledGuidesDir, sourceFile)

      mkdirSync(dirname(targetPath), { recursive: true })
      copyFileSync(sourcePath, targetPath)
    })
  },
})

export default defineConfig({
  plugins: [bundleSuiApi(), bundleGuides()],
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
