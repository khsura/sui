import { fileURLToPath } from 'node:url'
import { GUIDES_DIRNAME, REPO_ROOT_FROM_CONFIGS } from '../constants'

// The build copies every mapped source into dist/guides beside dist/index.js.
export const bundledGuidesRoot = fileURLToPath(new URL(`./${GUIDES_DIRNAME}`, import.meta.url))
// Unbundled (dev, tests) the sources are read straight from the monorepo.
export const repoGuidesRoot = fileURLToPath(new URL(REPO_ROOT_FROM_CONFIGS, import.meta.url))
