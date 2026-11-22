/** `Avatar`, `SkeletonLoader`, or the same with the `S` prefix (`SAvatar`). */
export const COMPONENT_NAME_PATTERN = /^S?[A-Z][a-zA-Z0-9]*$/
/** Splits `SkeletonLoader` into `Skeleton` and `Loader` for the kebab-case file names. */
export const WORD_BOUNDARY_PATTERN = /([a-z0-9])([A-Z])/g
export const COMPONENT_PREFIX = 'S'
export const PROPS_TYPE_PREFIX = 'Props'
export const CSS_BLOCK_PREFIX = 's_'
export const DRY_RUN_FLAG = '--dry-run'
/** `process.argv` holds the node binary and the script path before the user's arguments. */
export const CLI_ARGUMENTS_START = 2
export const EXIT_CODE_FAILURE = 1
export const SCAFFOLD_USAGE = 'Usage: yarn scaffold:component <Name> [--dry-run]   e.g. yarn scaffold:component Avatar'

/** Paths relative to packages/app. */
export const PROPS_DIR = 'definitions/props'
export const COMPONENTS_DIR = 'components'
export const STORIES_DIR = 'storybook/stories'
export const COMPONENT_TESTS_DIR = 'tests/components'
export const COMPONENT_DOCS_DIR = 'docs/components'
export const SKILL_REFERENCES_DIR = '../../plugins/sui-plugin/skills/sui-component/references'
export const BARREL_FILE = 'index.ts'
export const VUE_EXTENSION = '.vue'
export const TS_EXTENSION = '.ts'
export const MARKDOWN_EXTENSION = '.md'
export const TEST_FILE_SUFFIX = '.test.ts'
export const STORY_FILE_SUFFIX = '.stories.ts'
export const COMPONENT_DOCS_INDEX_FILE = 'docs/summary.md'
export const SKILL_INDEX_FILE = '../../plugins/sui-plugin/skills/sui-component/SKILL.md'
export const CHECKLIST_FILE = 'docs/new-component-checklist.md'

/** Places outside the generated files that mention a component name before it exists. */
export const NOT_EXISTING_COMPONENT_FILES = [
  '../../plugins/sui-plugin/skills/sui-component/SKILL.md',
  '../mcp/src/constants/componentAliases.ts',
]

/** `export * from './propsX'` lines in definitions/props/index.ts. */
export const PROPS_EXPORT_PATTERN = /^export \* from '\.\/(props\w+)'$/
/** `export { default as SX } from './sX.vue'` lines directly in components/index.ts. */
export const COMPONENT_EXPORT_PATTERN = /^export \{ default as (S\w+) \} from '\.\/s\w+\.vue'$/
/** A row of a markdown table whose first cell starts with a component name: "| `SChip` | …". */
export const COMPONENT_TABLE_ROW_PATTERN = /^\| `(S\w+)`/
/** The heading that opens the reference table in the sui-component SKILL.md. */
export const SKILL_INDEX_HEADING = '## Reference index'
/** The heading that opens the first table in docs/summary.md. */
export const SUMMARY_FIRST_TABLE_HEADING = '## Basic UI'

export const DOCS_SITE_URL = 'https://sui.surakh.com/'
export const STORY_TITLE_PREFIX = 'UI Components/'
export const LINE_BREAK = '\n'
export const TABLE_ROW_START = '|'
