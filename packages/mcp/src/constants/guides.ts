export const GUIDE_TOPICS = [
  'installation',
  'theming',
  'component-defaults',
  'display',
  'i18n',
  'common-mistakes',
] as const

export const INSTALLATION_GUIDE_TOPIC = 'installation'
export const GUIDES_DIRNAME = 'guides'
export const GUIDE_TEXT_ENCODING = 'utf8'
export const MIN_GUIDE_TOPIC_LENGTH = 1
/** From `src/configs/` (dev and tests) up to the monorepo root that holds the guide sources. */
export const REPO_ROOT_FROM_CONFIGS = '../../../../'

export const GETTING_STARTED_SKILL_PATH = 'plugins/sui-plugin/skills/sui-getting-started/SKILL.md'
export const UTILITY_CLASSES_DOC_PATH = 'packages/app/docs/classes.md'

export const LIVE_EXAMPLES_URL = 'https://sui.surakh.com/'
export const LIVE_EXAMPLES_LINE = `Live examples: ${LIVE_EXAMPLES_URL}`

export const MARKDOWN_HEADING_PATTERN = /^(#{1,6})\s+(\S.*?)\s*$/
export const MARKDOWN_FENCE_PATTERN = /^\s*(?:`{3,}|~{3,})/
export const GUIDE_SECTION_SEPARATOR = '\n\n'
/** A blank line or a `---` rule, trimmed from the end of an extracted section. */
export const MARKDOWN_TRAILING_FILLER_PATTERN = /^\s*(?:-{3,})?\s*$/
/** Spaces and underscores in a requested topic are read as `-` (`common mistakes` → `common-mistakes`). */
export const GUIDE_TOPIC_SEPARATOR_PATTERN = /[\s_]+/g
export const GUIDE_TOPIC_SEPARATOR = '-'
