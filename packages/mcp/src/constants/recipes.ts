/** Published recipe names; `validate_sui_template` issues point to these exact names. */
export const RECIPE_NAMES = [
  'app-shell',
  'validated-form',
  'activator-overlays',
  'data-table',
  'responsive-grid',
  'theme-setup',
  'filter-bar',
  'centered-page',
] as const

export const RECIPES_DIRNAME = 'recipes'
/** Repo-relative folder that holds the recipe sources (Storybook renders the same files). */
export const RECIPE_SOURCE_DIR = 'packages/app/storybook/recipes'
export const RECIPE_CODE_EXTENSION = '.vue'
export const RECIPE_NOTES_EXTENSION = '.md'
export const RECIPE_TEXT_ENCODING = 'utf8'
export const MIN_RECIPE_NAME_LENGTH = 1
export const MIN_FRONT_MATTER_VALUE_LENGTH = 1

/** A `---` delimited YAML-style block at the top of a markdown file, then the body. */
export const FRONT_MATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/
/** One `key: value` line of a front-matter block. */
export const FRONT_MATTER_LINE_PATTERN = /^([A-Za-z][\w-]*):\s*(.*?)\s*$/
export const FRONT_MATTER_LINE_SEPARATOR = /\r?\n/
export const RECIPE_COMPONENT_SEPARATOR = ','

/** Storybook story id prefix: the `Recipes` stories are `recipes--<recipe name>`. */
export const RECIPE_STORY_PATH_PREFIX = '?path=/story/recipes--'
/** Spaces and underscores in a requested name are read as `-` (`app shell` → `app-shell`). */
export const RECIPE_NAME_SEPARATOR_PATTERN = /[\s_]+/g
export const RECIPE_NAME_SEPARATOR = '-'
export const CODE_FENCE = '```'
export const VUE_FENCE_LANGUAGE = 'vue'
export const BACKTICK = '`'
export const BACKTICK_RUN_PATTERN = /`+/g
