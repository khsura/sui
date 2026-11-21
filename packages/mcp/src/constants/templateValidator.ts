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

export const RULE_ACTIVATOR_BINDING = 'activator-binding'
export const RULE_LAYOUT_FOR = 'layout-for'
export const RULE_FORM_RULES_OUTSIDE_FORM = 'form-rules-outside-form'
export const RULE_ICON_BUTTON_LABEL = 'icon-button-label'
export const RULE_NO_RAW_REPLACEMENT = 'no-raw-replacement'

/** Which elements the engine hands a rule: SUI components only (the default) or every element. */
export const RULE_TARGET_SUI_COMPONENT = 'sui-component'
export const RULE_TARGET_ANY_ELEMENT = 'any-element'

/** Recipe names an issue points to; the recipes are published under these exact names. */
export const RECIPE_APP_SHELL = 'app-shell'
export const RECIPE_VALIDATED_FORM = 'validated-form'
export const RECIPE_ACTIVATOR_OVERLAYS = 'activator-overlays'
export const RECIPE_DATA_TABLE = 'data-table'
export const RECIPE_RESPONSIVE_GRID = 'responsive-grid'
export const RECIPE_THEME_SETUP = 'theme-setup'

export const ACTIVATOR_SLOT_NAME = 'activator'
export const ACTIVATOR_ON_KEY = 'on'
export const ACTIVATOR_ATTRS_KEY = 'attrs'
/** Overlays whose `#activator` slot passes `{ on, attrs }` for the caller to bind. */
export const SLOT_PROP_ACTIVATOR_COMPONENTS = ['SDialog', 'SMenu', 'SSnackbar']
/** STooltip wraps the activator in its own listening element and passes no slot props. */
export const SLOTLESS_ACTIVATOR_COMPONENTS = ['STooltip']
export const DIRECTIVE_ON = 'on'

export const LAYOUT_COMPONENT = 'SLayout'
export const LAYOUT_NAME_ATTRIBUTE = 'name'
export const LAYOUT_FOR_ATTRIBUTE = 'for'
/** A layout child with `app` joins the app-level layout on purpose, so it needs no `for`. */
export const LAYOUT_APP_ATTRIBUTE = 'app'

export const FORM_COMPONENT = 'SForm'
export const RULES_ATTRIBUTE = 'rules'

export const BUTTON_COMPONENT = 'SButton'
export const ICON_COMPONENT = 'SIcon'
export const ACCESSIBLE_LABEL_ATTRIBUTES = ['aria-label', 'aria-labelledby', 'title']

export const INPUT_TAG = 'input'
export const INPUT_TYPE_ATTRIBUTE = 'type'
/** Native `<input type>` values that are not a visible control, so no SUI replacement applies. */
export const NON_VISUAL_INPUT_TYPES = ['hidden']
/** Native tags with a SUI replacement, and the component to use instead. */
export const RAW_TAG_REPLACEMENTS = new Map([
  ['button', 'SButton'],
  ['input', 'SInput'],
  ['select', 'SSelect'],
  ['textarea', 'STextarea'],
  ['dialog', 'SDialog'],
])
/** `<input type>` values whose SUI replacement is not SInput. */
export const RAW_INPUT_TYPE_REPLACEMENTS = new Map([
  ['checkbox', 'SCheckbox'],
  ['radio', 'SRadioGroup'],
])

/** A bare JavaScript identifier (`props` in `#activator="props"`). */
export const IDENTIFIER_PATTERN = /^[A-Za-z_$][\w$]*$/
export const REST_ELEMENT_PREFIX = '...'
export const WHITESPACE_PATTERN = /\s+/g

/** Tokens of a destructuring slot props pattern such as `{ on: open, attrs = {}, ...rest }`. */
export const OBJECT_PATTERN_OPEN = '{'
export const OBJECT_PATTERN_CLOSE = '}'
export const OPENING_BRACKETS = '{[('
export const CLOSING_BRACKETS = '}])'
export const ENTRY_SEPARATOR = ','
export const RENAME_SEPARATOR = ':'
export const DEFAULT_SEPARATOR = '='

export const DIALOG_TAG = 'dialog'
export const ACTIVATOR_BINDING_FIX =
  'Write `#activator="{ on, attrs }"` and put both `v-on="on"` and `v-bind="attrs"` on the activator\'s root element.'
