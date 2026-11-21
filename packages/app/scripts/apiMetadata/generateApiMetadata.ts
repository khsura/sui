import fs from 'node:fs'
import path from 'node:path'
import { buildApiMetadata } from './buildApiMetadata'
import { API_METADATA_FILE, DIST_DIR, EXIT_CODE_FAILURE, JSON_INDENT } from './constants'

// Build entry: runs after `vite build` (prebuild wipes dist), writes dist/sui-api.json.
// Progress goes to stderr so stdout stays clean for piping.
const appRoot = path.resolve(import.meta.dirname, '../..')

try {
  const api = buildApiMetadata(appRoot)
  const outputFile = path.join(appRoot, DIST_DIR, API_METADATA_FILE)

  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, `${JSON.stringify(api, null, JSON_INDENT)}\n`)
  process.stderr.write(`sui-api.json: ${api.components.length} components (v${api.version})\n`)
} catch (error) {
  process.stderr.write(`sui-api.json generation failed: ${String(error)}\n`)
  process.exit(EXIT_CODE_FAILURE)
}
