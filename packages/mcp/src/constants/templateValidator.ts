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
  'novalidate',
]

/** A bound expression that is just a string literal (`:size="'small'"`), so its value is still known statically. */
export const STRING_LITERAL_EXPRESSION = /^\s*(['"`])([^'"`$\\]*)\1\s*$/

export const RULE_ACTIVATOR_BINDING = 'activator-binding'
export const RULE_LAYOUT_FOR = 'layout-for'
export const RULE_FORM_RULES_OUTSIDE_FORM = 'form-rules-outside-form'
export const RULE_ICON_BUTTON_LABEL = 'icon-button-label'
export const RULE_NO_RAW_REPLACEMENT = 'no-raw-replacement'
export const RULE_NATIVE_VALIDATION_IN_FORM = 'native-validation-in-form'
export const RULE_HIDE_DETAILS_HIDES_LABEL = 'hide-details-hides-label'
export const RULE_SNACKBAR_ACTION_CONTRAST = 'snackbar-action-contrast'
export const RULE_BLOCK_BUTTONS_IN_ROW = 'block-buttons-in-row'
export const RULE_CARD_TITLE_TEXT_ALIGN = 'card-title-text-align'
export const RULE_DATE_PICKER_EMPTY_STRING = 'date-picker-empty-string'
export const RULE_FIELD_BUTTON_ROW = 'field-button-row'

/**
 * The first `@khsura/sui` release with the M2 hardening fixes (SForm `novalidate`, SCheckbox label with
 * `hide-details`, `''` as "no date", snackbar action colour, SCardTitle `s_textAlign__*`). Rules for
 * those behaviours set it as `fixedIn`, so they only warn for projects on an older version.
 */
export const SUI_M2_FIXES_VERSION = '1.20.0'

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
export const RECIPE_FILTER_BAR = 'filter-bar'

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

/** `<input type>` values the browser validates on submit, showing its own bubble on top of SUI's error text. */
export const INPUT_TYPE_NUMBER = 'number'
export const NATIVE_VALIDATING_INPUT_TYPES = ['email', 'url', 'number']
/** On SForm it reaches the rendered `<form>` and turns the browser's own validation off. */
export const NO_VALIDATE_ATTRIBUTE = 'novalidate'

export const HIDE_DETAILS_ATTRIBUTE = 'hide-details'
export const LABEL_ATTRIBUTE = 'label'
/** Inputs whose only visible text is the `label` prop, which `hide-details` hides as well. */
export const HIDE_DETAILS_LABEL_COMPONENTS = ['SCheckbox']

export const SNACKBAR_COMPONENT = 'SSnackbar'
export const SNACKBAR_ACTION_SLOT_NAME = 'action'
export const COLOR_ATTRIBUTE = 'color'
export const VARIANT_ATTRIBUTE = 'variant'
export const TEXT_BUTTON_VARIANT = 'text'
/** Action variants that, before the M2 fix, kept the page's dark text colour on the dark snackbar when no `color` was set. */
export const SNACKBAR_UNCOLOURED_ACTION_VARIANTS = ['text', 'icon']
/** `s_textColor__*` sets a button's text colour, which also keeps an uncoloured action readable. */
export const TEXT_COLOR_CLASS_PREFIX = 's_textColor__'
/** Preset colours below 4.5:1 as text on the default `#424242` snackbar (primary is 2.18:1). */
export const SNACKBAR_UNREADABLE_PRESET_COLORS = ['primary', 'secondary', 'success', 'info', 'error']
export const SNACKBAR_READABLE_ACTION_COLOR = 'warning'
export const SNACKBAR_LIGHT_ACTION_COLOR_HINT = `\`color="${SNACKBAR_READABLE_ACTION_COLOR}"\` or a CSS colour such as \`color="#ffffff"\``

export const BLOCK_ATTRIBUTE = 'block'
export const MIN_BLOCK_BUTTONS_IN_ROW = 2
/** Components whose root is a `display: flex` row. */
export const FLEX_ROW_COMPONENTS = ['SCardActions']
/** Text fields that render a label above their box and an error line under it. */
export const LABELLED_FIELD_COMPONENTS = ['SInput', 'SSelect', 'SDatePickerInput', 'SAutocomplete', 'STextarea']
/** The row that lines buttons up with the field boxes next to them (since 1.20.0). */
export const FORM_ROW_COMPONENT = 'SFormRow'
/** `s_display__flex`, `s_display--md__inlineFlex`: the utility classes that make an element a flex row. */
export const FLEX_DISPLAY_CLASS_PATTERN = /^s_display(?:--[a-z]+)?__(?:flex|inlineFlex)$/
export const FLEX_DISPLAY_STYLE_PATTERN = /(?:^|;)\s*display\s*:\s*(?:inline-)?flex\b/
export const CLASS_ATTRIBUTE = 'class'
export const STYLE_ATTRIBUTE = 'style'
export const FALSE_LITERAL = 'false'

export const CARD_TITLE_COMPONENT = 'SCardTitle'
/** `s_textAlign__center`, `s_textAlign--md__center`. */
export const TEXT_ALIGN_CLASS_PATTERN = /^s_textAlign(?:--[a-z]+)?__([a-z]+)$/
/** The `justify` utility for each text-align value, which does centre a flex container's content. */
export const TEXT_ALIGN_JUSTIFY_CLASSES = new Map([
  ['left', 's_justify__start'],
  ['start', 's_justify__start'],
  ['center', 's_justify__center'],
  ['right', 's_justify__end'],
  ['end', 's_justify__end'],
])

export const DATE_PICKER_EMPTY_STRING_COMPONENTS = ['SDatePickerInput']
export const MODEL_VALUE_ATTRIBUTE = 'model-value'
/** `''` or `""` as a whole expression. */
export const EMPTY_STRING_EXPRESSION = /^\s*(['"])\1\s*$/
/** A dotted model path (`draft.from`, `startDate`) whose last segment can be looked up in the script. */
export const MODEL_PATH_PATTERN = /^\s*[A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*)*\s*$/
export const MODEL_PATH_SEPARATOR = /\??\./
export const REGEX_SPECIAL_CHARACTERS = /[$]/g
export const REGEX_ESCAPE_REPLACEMENT = '\\$&'
/** Placeholder in the script patterns below, replaced by the model's last path segment. */
export const MODEL_NAME_PLACEHOLDER = '__name__'
/** `from: ''` in an object literal, or `startDate = ref('')` / `ref<string>("")`. */
export const EMPTY_STRING_INITIAL_PATTERNS = [
  `(?:^|[^\\w$.])${MODEL_NAME_PLACEHOLDER}\\s*:\\s*(['"])\\1`,
  `(?:^|[^\\w$.])${MODEL_NAME_PLACEHOLDER}\\s*=\\s*(?:ref|shallowRef)\\s*(?:<[^>]*>)?\\s*\\(\\s*(['"])\\1\\s*\\)`,
]

/** Joins an SFC's `<script>` and `<script setup>` contents into one searchable source. */
export const SCRIPT_BLOCK_SEPARATOR = '\n'

export const DIALOG_TAG = 'dialog'
export const ACTIVATOR_BINDING_FIX =
  'Write `#activator="{ on, attrs }"` and put both `v-on="on"` and `v-bind="attrs"` on the activator\'s root element.'
