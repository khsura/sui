export const RULE_PARSE_ERROR = 'parse-error'
export const RULE_UNKNOWN_COMPONENT = 'unknown-component'
export const RULE_UNKNOWN_PROP = 'unknown-prop'
export const RULE_INVALID_ENUM_VALUE = 'invalid-enum-value'
export const RULE_UNKNOWN_SLOT = 'unknown-slot'

export const SEVERITY_ERROR = 'error'
export const SEVERITY_WARNING = 'warning'

export const MIN_TEMPLATE_CODE_LENGTH = 1
export const MAX_PROP_SUGGESTIONS = 3
/** A prop suggestion farther than this many edits from the typed name is noise, not a typo fix. */
export const MAX_PROP_SUGGESTION_DISTANCE = 3

/** `SButton` (PascalCase) or `s-button` (kebab-case): the only tags the validator treats as SUI components. */
export const SUI_PASCAL_TAG_PATTERN = /^S[A-Z]/
export const SUI_KEBAB_TAG_PATTERN = /^s-[a-z]/

export const DIRECTIVE_BIND = 'bind'
export const DIRECTIVE_MODEL = 'model'
export const DIRECTIVE_SLOT = 'slot'
export const DEFAULT_MODEL_PROP = 'modelValue'
export const DEFAULT_SLOT_NAME = 'default'
export const TEMPLATE_TAG = 'template'

/** Attribute prefixes that always fall through to the root element. */
export const FALLTHROUGH_ATTRIBUTE_PREFIXES = ['aria-', 'data-']

/** `onClick="…"` written as a plain attribute is a listener, not a prop. */
export const LISTENER_ATTRIBUTE_PATTERN = /^on[A-Z]/

/**
 * Global and common native attributes. SUI components render a native root element, so these fall
 * through to it instead of being props; they are never reported as unknown props.
 */
export const FALLTHROUGH_ATTRIBUTES = [
  'class',
  'style',
  'key',
  'ref',
  'id',
  'role',
  'title',
  'tabindex',
  'hidden',
  'lang',
  'dir',
  'draggable',
  'contenteditable',
  'inert',
  'is',
  'slot',
  'href',
  'rel',
  'type',
  'name',
  'value',
  'form',
  'autocomplete',
  'autofocus',
  'placeholder',
  'alt',
  'src',
]

/** A bound expression that is just a string literal (`:size="'small'"`), so its value is still known statically. */
export const STRING_LITERAL_EXPRESSION = /^\s*(['"`])([^'"`$\\]*)\1\s*$/
