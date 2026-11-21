import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import { guideSourceFiles, recipeSourceFiles } from './src/configs'
import { RECIPE_SOURCE_DIR } from './src/constants'

const appSuiApiPath = fileURLToPath(new URL('../app/dist/sui-api.json', import.meta.url))
const bundledSuiApiPath = fileURLToPath(new URL('./dist/sui-api.json', import.meta.url))
const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
const bundledGuidesDir = fileURLToPath(new URL('./dist/guides', import.meta.url))
const bundledRecipesDir = fileURLToPath(new URL('./dist/recipes', import.meta.url))

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

// Copies every recipe (`<name>.vue` + `<name>.md`) into dist/recipes, so get_recipe serves the tested files as built.
const bundleRecipes = (): Plugin => ({
  name: 'bundle-recipes',
  apply: 'build',
  closeBundle() {
    mkdirSync(bundledRecipesDir, { recursive: true })
    recipeSourceFiles.forEach((fileName) => {
      const sourcePath = join(repoRoot, RECIPE_SOURCE_DIR, fileName)

      if (!existsSync(sourcePath)) {
        this.error(`Recipe source ${sourcePath} not found; update RECIPE_NAMES in src/constants/recipes.ts.`)
      }

      copyFileSync(sourcePath, join(bundledRecipesDir, fileName))
    })
  },
})

export default defineConfig({
  plugins: [bundleSuiApi(), bundleGuides(), bundleRecipes()],
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
