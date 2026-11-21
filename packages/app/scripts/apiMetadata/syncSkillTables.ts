import fs from 'node:fs'
import path from 'node:path'
import { suiApiSchema } from '@khsura/shared/schemas'
import {
  API_METADATA_FILE,
  DIST_DIR,
  EXIT_CODE_FAILURE,
  MARKDOWN_EXTENSION,
  SKILL_REFERENCES_DIR,
  SKILL_TABLE_CHECK_FLAG,
} from './constants'
import { syncSkillTableMarkdown } from './skillTables'

// Build/CI entry: rewrites the generated API tables in the sui-plugin skill references from
// dist/sui-api.json (run `yarn build:api` first). `--check` writes nothing and exits 1 when a file is stale.
const appRoot = path.resolve(import.meta.dirname, '../..')
const checkOnly = process.argv.includes(SKILL_TABLE_CHECK_FLAG)
const apiFile = path.join(appRoot, DIST_DIR, API_METADATA_FILE)
const referencesDir = path.join(appRoot, SKILL_REFERENCES_DIR)

const fail = (message: string): never => {
  process.stderr.write(`${message}\n`)
  process.exit(EXIT_CODE_FAILURE)
}

if (!fs.existsSync(apiFile)) {
  fail(`${path.relative(appRoot, apiFile)} not found — run \`yarn build:api\` first.`)
}

const api = suiApiSchema.parse(JSON.parse(fs.readFileSync(apiFile, 'utf8')))

const referenceFiles = fs
  .readdirSync(referencesDir)
  .filter((fileName) => fileName.endsWith(MARKDOWN_EXTENSION))
  .sort()

const staleFiles: string[] = []
const problems: string[] = []
let componentCount = 0

for (const fileName of referenceFiles) {
  const filePath = path.join(referencesDir, fileName)
  const original = fs.readFileSync(filePath, 'utf8')
  const sync = syncSkillTableMarkdown(original, api)

  componentCount += sync.components.length
  problems.push(
    ...sync.unknownComponents.map((name) => `${fileName}: unknown component ${name} in a generated:api marker`),
    ...sync.malformedMarkers.map((marker) => `${fileName}: ${marker}`),
  )

  if (sync.content !== original) {
    staleFiles.push(fileName)

    if (!checkOnly) {
      fs.writeFileSync(filePath, sync.content)
    }
  }
}

if (problems.length) {
  fail(problems.join('\n'))
}

if (checkOnly && staleFiles.length) {
  fail(
    `Skill API tables are stale in ${staleFiles.length} file(s):\n${staleFiles.map((fileName) => `  ${fileName}`).join('\n')}\nRun \`yarn sync:skills\` in packages/app and commit the result.`,
  )
}

process.stderr.write(
  `skill tables: ${componentCount} components in ${referenceFiles.length} files, ${checkOnly ? 'all up to date' : `${staleFiles.length} file(s) updated`}\n`,
)
