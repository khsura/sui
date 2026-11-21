import { fileURLToPath } from 'node:url'
import { SUI_API_FILENAME } from '../constants'

// The build bundles everything into dist/index.js and copies sui-api.json beside it.
export const bundledSuiApiPath = fileURLToPath(new URL(`./${SUI_API_FILENAME}`, import.meta.url))
