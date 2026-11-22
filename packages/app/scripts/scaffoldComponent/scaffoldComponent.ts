import fs from 'node:fs'
import path from 'node:path'
import { toComponentNames } from './componentNames'
import {
  CHECKLIST_FILE,
  CLI_ARGUMENTS_START,
  DRY_RUN_FLAG,
  EXIT_CODE_FAILURE,
  NOT_EXISTING_COMPONENT_FILES,
  SCAFFOLD_USAGE,
} from './constants'
import { planScaffoldFiles, planScaffoldRegistrations } from './scaffoldPlan'

// CLI entry (`yarn scaffold:component <Name> [--dry-run]` in packages/app): writes the skeleton of every file
// docs/new-component-checklist.md asks for, and registers the component in the barrels and indexes.
// Output goes to stderr, like the apiMetadata scripts.
const appRoot = path.resolve(import.meta.dirname, '../..')
const cliArguments = process.argv.slice(CLI_ARGUMENTS_START)
const dryRun = cliArguments.includes(DRY_RUN_FLAG)
const [nameArgument] = cliArguments.filter((argument) => argument !== DRY_RUN_FLAG)
const log = (message: string) => process.stderr.write(`${message}\n`)

const fail = (message: string): never => {
  log(message)
  process.exit(EXIT_CODE_FAILURE)
}

if (!nameArgument) {
  fail(SCAFFOLD_USAGE)
}

const names = (() => {
  try {
    return toComponentNames(nameArgument)
  } catch (error) {
    return fail(`${String(error)}\n${SCAFFOLD_USAGE}`)
  }
})()

const files = planScaffoldFiles(names)
const existingFiles = files.filter((file) => fs.existsSync(path.join(appRoot, file.path)))

if (existingFiles.length) {
  fail(`${names.component} already has:\n${existingFiles.map((file) => `  ${file.path}`).join('\n')}\nNothing written.`)
}

// Compute every registration before writing anything, so a barrel that cannot be updated leaves no half scaffold.
const registrations = planScaffoldRegistrations(names).map((registration) => {
  const filePath = path.join(appRoot, registration.path)

  return { ...registration, filePath, content: registration.update(fs.readFileSync(filePath, 'utf8')) }
})

// Read before the SKILL.md index row is written, so the new row is not reported as a stale mention.
const staleMentions = NOT_EXISTING_COMPONENT_FILES.filter((file) =>
  fs.readFileSync(path.join(appRoot, file), 'utf8').includes(names.component),
)

if (!dryRun) {
  files.forEach((file) => {
    const filePath = path.join(appRoot, file.path)

    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, file.content)
  })
  registrations.forEach((registration) => fs.writeFileSync(registration.filePath, registration.content))
}

log(`${dryRun ? 'Would create' : 'Created'} ${names.component}:`)
files.forEach((file) => log(`  + ${file.path}`))
registrations.forEach((registration) => log(`  ~ ${registration.path}`))
staleMentions.forEach((file) =>
  log(`  ! ${file} mentions ${names.component} as missing or as an alias: remove that entry now that it exists.`),
)
log(`Next: fill every TODO(scaffold), then work through ${CHECKLIST_FILE}.`)
