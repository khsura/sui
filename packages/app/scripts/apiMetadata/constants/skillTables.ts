/** `<!-- generated:api:start SButton --> … <!-- generated:api:end SButton -->` in the plugin skill references. */
export const SKILL_TABLE_MARKER_PATTERN = /<!-- generated:api:(start|end) (\S+) -->/g
export const SKILL_TABLE_MARKER_START = 'start'
export const SKILL_TABLE_NOTICE =
  '<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->'
export const SKILL_REFERENCES_DIR = '../../plugins/sui-plugin/skills/sui-component/references'
export const MARKDOWN_EXTENSION = '.md'
export const SKILL_TABLE_EMPTY_CELL = '—'
export const SKILL_TABLE_NONE = 'None.'
export const SKILL_TABLE_OPTIONAL_TYPE_SUFFIX = / \| undefined$/
export const SKILL_TABLE_PROP_HEADERS = ['Prop', 'Type', 'Default', 'Required', 'Values']
export const SKILL_TABLE_SLOT_HEADERS = ['Slot', 'Slot props']
export const SKILL_TABLE_EVENT_HEADERS = ['Event', 'Payload']
export const SKILL_TABLE_DESCRIPTION_HEADER = 'Description'
export const SKILL_TABLE_REQUIRED_YES = 'yes'
export const SKILL_TABLE_REQUIRED_NO = 'no'
export const SKILL_TABLE_CHECK_FLAG = '--check'
export const MARKDOWN_TABLE_SEPARATOR = '---'
export const MARKDOWN_TABLE_PIPE_PATTERN = /\|/g
export const MARKDOWN_TABLE_NEWLINE_PATTERN = /\s*\n\s*/g
