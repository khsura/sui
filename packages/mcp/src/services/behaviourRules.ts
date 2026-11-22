import type { ElementNode } from '@vue/compiler-dom'
import type { TemplateIssue, TemplateRule } from '../types'
import {
  APP_COMPONENT,
  BLOCK_ATTRIBUTE,
  BUTTON_COMPONENT,
  CARD_TITLE_COMPONENT,
  CLASS_ATTRIBUTE,
  COLOR_ATTRIBUTE,
  DATE_PICKER_EMPTY_STRING_COMPONENTS,
  DIRECTIVE_MODEL,
  EMPTY_STRING_EXPRESSION,
  EMPTY_STRING_INITIAL_PATTERNS,
  FLEX_DISPLAY_CLASS_PATTERN,
  FLEX_DISPLAY_STYLE_PATTERN,
  FLEX_ROW_COMPONENTS,
  FORM_COMPONENT,
  FORM_ROW_COMPONENT,
  HEIGHT_FILL_CLASS,
  HIDE_DETAILS_ATTRIBUTE,
  HIDE_DETAILS_LABEL_COMPONENTS,
  INPUT_TYPE_ATTRIBUTE,
  INPUT_TYPE_NUMBER,
  LABEL_ATTRIBUTE,
  LABELLED_FIELD_COMPONENTS,
  MIN_BLOCK_BUTTONS_IN_ROW,
  MODEL_NAME_PLACEHOLDER,
  MODEL_PATH_PATTERN,
  MODEL_PATH_SEPARATOR,
  MODEL_VALUE_ATTRIBUTE,
  NATIVE_VALIDATING_INPUT_TYPES,
  NO_VALIDATE_ATTRIBUTE,
  PAGINATION_COMPONENT,
  PAGINATION_LENGTH_ATTRIBUTE,
  PAGINATION_PAGE_MATH_EXPRESSION,
  PAGINATION_ROW_COUNT_EXPRESSION,
  PAGINATION_ZERO_BASED_MODEL,
  RECIPE_ACTIVATOR_OVERLAYS,
  RECIPE_CENTERED_PAGE,
  RECIPE_FILTER_BAR,
  RECIPE_RESPONSIVE_GRID,
  RECIPE_VALIDATED_FORM,
  REGEX_ESCAPE_REPLACEMENT,
  REGEX_SPECIAL_CHARACTERS,
  RULE_BLOCK_BUTTONS_IN_ROW,
  RULE_CARD_TITLE_TEXT_ALIGN,
  RULE_DATE_PICKER_EMPTY_STRING,
  RULE_FIELD_BUTTON_ROW,
  RULE_FILL_HEIGHT_UNDER_APP,
  RULE_HIDE_DETAILS_HIDES_LABEL,
  RULE_NATIVE_VALIDATION_IN_FORM,
  RULE_PAGINATION_LENGTH_ROWS,
  RULE_PAGINATION_ZERO_BASED,
  RULE_SNACKBAR_ACTION_CONTRAST,
  RULE_TARGET_ANY_ELEMENT,
  SEVERITY_WARNING,
  SNACKBAR_ACTION_SLOT_NAME,
  SNACKBAR_COMPONENT,
  SNACKBAR_DEFAULT_BACKGROUND,
  SNACKBAR_LIGHT_ACTION_COLOR_HINT,
  SNACKBAR_UNCOLOURED_ACTION_VARIANTS,
  SNACKBAR_UNREADABLE_PRESET_COLORS,
  MINIMUM_TEXT_CONTRAST,
  STYLE_ATTRIBUTE,
  SUI_M2_FIXES_VERSION,
  TEXT_COLOR_CLASS_PREFIX,
  TEXT_ALIGN_CLASS_PATTERN,
  TEXT_ALIGN_JUSTIFY_CLASSES,
  TEXT_BUTTON_VARIANT,
  VARIANT_ATTRIBUTE,
} from '../constants'
import { getHexContrastRatio, isVersionAtLeast } from '../lib'
import {
  childElementsOf,
  descendantElementsOf,
  expressionSource,
  findAttribute,
  findPropAttribute,
  isBooleanPropOn,
  isComponentTag,
  isDirective,
  isOneOfComponentTags,
  positionOf,
  slotFills,
  staticArgument,
  staticClassNames,
} from '../utils'

export const nativeValidationInFormRule: TemplateRule = {
  id: RULE_NATIVE_VALIDATION_IN_FORM,
  fixedIn: SUI_M2_FIXES_VERSION,
  check: ({ element, ancestors }) => {
    const typeAttribute = findAttribute(element, INPUT_TYPE_ATTRIBUTE)
    const inputType = typeAttribute?.staticValue?.toLowerCase()
    const form = ancestors.filter((ancestor) => isComponentTag(ancestor.tag, FORM_COMPONENT)).at(-1)

    if (!typeAttribute || !inputType || !NATIVE_VALIDATING_INPUT_TYPES.includes(inputType) || !form) {
      return []
    }

    if (findAttribute(form, NO_VALIDATE_ATTRIBUTE)) {
      return []
    }

    return [
      {
        ...positionOf(typeAttribute.node),
        rule: RULE_NATIVE_VALIDATION_IN_FORM,
        severity: SEVERITY_WARNING,
        message: `\`type="${inputType}"\` on \`${element.tag}\` inside \`SForm\` turns on the browser's own validation: on submit its bubble covers SUI's error text and blocks the submit handler.`,
        fixHint:
          inputType === INPUT_TYPE_NUMBER
            ? 'Add `novalidate` to the `SForm` (it reaches the rendered `<form>`) and validate with `rules`.'
            : `Use \`type="text" inputmode="${inputType}" autocomplete="${inputType}"\` and check the format with a rule, or add \`novalidate\` to the \`SForm\`.`,
        recipe: RECIPE_VALIDATED_FORM,
      },
    ]
  },
}

export const hideDetailsHidesLabelRule: TemplateRule = {
  id: RULE_HIDE_DETAILS_HIDES_LABEL,
  fixedIn: SUI_M2_FIXES_VERSION,
  check: ({ element }) => {
    const hideDetails = findPropAttribute(element, HIDE_DETAILS_ATTRIBUTE)

    if (
      !isOneOfComponentTags(element.tag, HIDE_DETAILS_LABEL_COMPONENTS) ||
      !hideDetails ||
      !isBooleanPropOn(element, HIDE_DETAILS_ATTRIBUTE) ||
      !findAttribute(element, LABEL_ATTRIBUTE)
    ) {
      return []
    }

    return [
      {
        ...positionOf(hideDetails.node),
        rule: RULE_HIDE_DETAILS_HIDES_LABEL,
        severity: SEVERITY_WARNING,
        message: `\`hide-details\` on \`${element.tag}\` hides its \`label\` as well as the error line, so the checkbox shows no text.`,
        fixHint: 'Use `hide-error` to drop only the error line and keep the label.',
        recipe: RECIPE_VALIDATED_FORM,
      },
    ]
  },
}

const isUnreadablePresetAction = (button: ElementNode): boolean => {
  const color = findAttribute(button, COLOR_ATTRIBUTE)?.staticValue
  const variant = findAttribute(button, VARIANT_ATTRIBUTE)?.staticValue

  return variant === TEXT_BUTTON_VARIANT && color !== undefined && SNACKBAR_UNREADABLE_PRESET_COLORS.includes(color)
}

/** A text or icon action with a hex CSS colour below 4.5:1 on the default snackbar: used as is, in every version. */
const lowContrastCssColorOf = (button: ElementNode): { color: string; contrast: number } | undefined => {
  const color = findAttribute(button, COLOR_ATTRIBUTE)?.staticValue
  const variant = findAttribute(button, VARIANT_ATTRIBUTE)?.staticValue

  if (color === undefined || variant === undefined || !SNACKBAR_UNCOLOURED_ACTION_VARIANTS.includes(variant)) {
    return undefined
  }

  const contrast = getHexContrastRatio(color, SNACKBAR_DEFAULT_BACKGROUND)

  return contrast !== undefined && contrast < MINIMUM_TEXT_CONTRAST ? { color, contrast } : undefined
}

/** A text or icon action with no colour at all: dark page text on the dark snackbar before the M2 fix. */
const isUncolouredAction = (button: ElementNode): boolean => {
  const variant = findAttribute(button, VARIANT_ATTRIBUTE)?.staticValue

  return (
    variant !== undefined &&
    SNACKBAR_UNCOLOURED_ACTION_VARIANTS.includes(variant) &&
    !findAttribute(button, COLOR_ATTRIBUTE) &&
    !staticClassNames(button).some((name) => name.startsWith(TEXT_COLOR_CLASS_PREFIX))
  )
}

const snackbarActionIssue = (button: ElementNode, hasSnackbarColorFix: boolean): TemplateIssue | undefined => {
  const base: Omit<TemplateIssue, 'message' | 'fixHint'> = {
    ...positionOf(button),
    rule: RULE_SNACKBAR_ACTION_CONTRAST,
    severity: SEVERITY_WARNING,
    recipe: RECIPE_ACTIVATOR_OVERLAYS,
  }

  const lowContrastCssColor = lowContrastCssColorOf(button)

  if (lowContrastCssColor) {
    return {
      ...base,
      message: `A \`color="${lowContrastCssColor.color}"\` action in the \`SSnackbar\` is ${lowContrastCssColor.contrast.toFixed(2)}:1 on the dark snackbar background (below 4.5:1), so the action is hard to read. A CSS colour is used as is.`,
      fixHint: hasSnackbarColorFix
        ? 'Remove `color` (an action without a colour uses the snackbar text colour), or use a light CSS colour such as `color="#ffffff"`.'
        : `Use a light colour: ${SNACKBAR_LIGHT_ACTION_COLOR_HINT}.`,
    }
  }

  if (hasSnackbarColorFix) {
    return undefined
  }

  if (isUnreadablePresetAction(button)) {
    const color = findAttribute(button, COLOR_ATTRIBUTE)?.staticValue ?? ''

    return {
      ...base,
      message: `Before @khsura/sui ${SUI_M2_FIXES_VERSION}, a \`color="${color}"\` text button in the \`SSnackbar\` action is below 4.5:1 on the dark snackbar background, so the action is hard to read.`,
      fixHint: `Use a light colour: ${SNACKBAR_LIGHT_ACTION_COLOR_HINT}, or upgrade to ${SUI_M2_FIXES_VERSION} or later and remove \`color\`.`,
    }
  }

  if (isUncolouredAction(button)) {
    return {
      ...base,
      message: `Before @khsura/sui ${SUI_M2_FIXES_VERSION}, a text or icon button without \`color\` in the \`SSnackbar\` action keeps the page's dark text colour (about 1.3:1 on the dark snackbar), so the action is hard to read.`,
      fixHint: `Set a light colour: ${SNACKBAR_LIGHT_ACTION_COLOR_HINT}, or upgrade to ${SUI_M2_FIXES_VERSION} or later.`,
    }
  }

  return undefined
}

/**
 * A hex CSS colour below 4.5:1 on the snackbar always warns: the snackbar cannot adjust it. Before
 * `SUI_M2_FIXES_VERSION` a low-contrast preset colour or no colour at all warns too; from that version an action
 * without a colour takes the snackbar's light text colour and a preset colour uses a variant tuned to the snackbar.
 */
export const snackbarActionContrastRule: TemplateRule = {
  id: RULE_SNACKBAR_ACTION_CONTRAST,
  check: ({ element, apiVersion }) => {
    if (!isComponentTag(element.tag, SNACKBAR_COMPONENT)) {
      return []
    }

    const hasSnackbarColorFix = isVersionAtLeast(apiVersion, SUI_M2_FIXES_VERSION)

    return slotFills(element)
      .filter((fill) => staticArgument(fill.directive.arg) === SNACKBAR_ACTION_SLOT_NAME)
      .flatMap((fill) => descendantElementsOf(fill.owner))
      .filter((descendant) => isComponentTag(descendant.tag, BUTTON_COMPONENT))
      .flatMap((button) => snackbarActionIssue(button, hasSnackbarColorFix) ?? [])
  },
}

const isFlexRow = (element: ElementNode): boolean =>
  isOneOfComponentTags(element.tag, FLEX_ROW_COMPONENTS) ||
  staticClassNames(element).some((name) => FLEX_DISPLAY_CLASS_PATTERN.test(name)) ||
  FLEX_DISPLAY_STYLE_PATTERN.test(findAttribute(element, STYLE_ATTRIBUTE)?.staticValue ?? '')

const isBlockButton = (element: ElementNode): boolean =>
  isComponentTag(element.tag, BUTTON_COMPONENT) && isBooleanPropOn(element, BLOCK_ATTRIBUTE)

export const blockButtonsInRowRule: TemplateRule = {
  id: RULE_BLOCK_BUTTONS_IN_ROW,
  target: RULE_TARGET_ANY_ELEMENT,
  check: ({ element }) => {
    const blockButtons = childElementsOf(element).filter(isBlockButton)

    if (blockButtons.length < MIN_BLOCK_BUTTONS_IN_ROW || !isFlexRow(element)) {
      return []
    }

    const [, secondButton] = blockButtons

    return [
      {
        ...positionOf(secondButton),
        rule: RULE_BLOCK_BUTTONS_IN_ROW,
        severity: SEVERITY_WARNING,
        message: `${blockButtons.length} \`block\` buttons sit side by side in one flex row; each is \`width: 100%\` and does not shrink, so the later ones are pushed off screen.`,
        fixHint:
          'Put each button in its own `SColumn` of an `SRow` (e.g. `:cols="6"`), or drop `block` from buttons that share a row.',
        recipe: RECIPE_RESPONSIVE_GRID,
      },
    ]
  },
}

/** A text field whose label and error line are rendered, so its box sits between them. */
const isDetailedField = (element: ElementNode): boolean =>
  isOneOfComponentTags(element.tag, LABELLED_FIELD_COMPONENTS) && !isBooleanPropOn(element, HIDE_DETAILS_ATTRIBUTE)

export const fieldButtonRowRule: TemplateRule = {
  id: RULE_FIELD_BUTTON_ROW,
  target: RULE_TARGET_ANY_ELEMENT,
  check: ({ element }) => {
    if (isComponentTag(element.tag, FORM_ROW_COMPONENT) || !isFlexRow(element)) {
      return []
    }

    const children = childElementsOf(element)
    const field = children.find(isDetailedField)
    const button = children.find((child) => isComponentTag(child.tag, BUTTON_COMPONENT))

    if (!field || !button) {
      return []
    }

    return [
      {
        ...positionOf(button),
        rule: RULE_FIELD_BUTTON_ROW,
        severity: SEVERITY_WARNING,
        message: `\`${field.tag}\` and an \`SButton\` share a flex row: the field is a label, its box and an error line, so the button lines up with the label instead of the field box.`,
        fixHint:
          'Use `<SFormRow>` instead of the flex element (@khsura/sui 1.20.0+); it lines each button up with the field box. On an older version put `hide-details` on the field.',
        recipe: RECIPE_FILTER_BAR,
      },
    ]
  },
}

export const cardTitleTextAlignRule: TemplateRule = {
  id: RULE_CARD_TITLE_TEXT_ALIGN,
  fixedIn: SUI_M2_FIXES_VERSION,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, CARD_TITLE_COMPONENT)) {
      return []
    }

    return staticClassNames(element).flatMap((className) => {
      const alignment = TEXT_ALIGN_CLASS_PATTERN.exec(className)?.[1]

      if (!alignment) {
        return []
      }

      const justifyClass = TEXT_ALIGN_JUSTIFY_CLASSES.get(alignment)

      return [
        {
          ...positionOf(findAttribute(element, CLASS_ATTRIBUTE)?.node ?? element),
          rule: RULE_CARD_TITLE_TEXT_ALIGN,
          severity: SEVERITY_WARNING,
          message: `\`${className}\` has no effect on \`SCardTitle\`: it is a flex container, so its text is placed by \`justify-content\`, not \`text-align\`.`,
          fixHint: justifyClass
            ? `Use \`${justifyClass}\` instead.`
            : 'Use an `s_justify__*` class instead, or wrap the text in an element that has the `text-align` class.',
        },
      ]
    })
  },
}

/** The directive or `:model-value` binding that feeds the component's model. */
const modelBinding = (element: ElementNode) => {
  const vModel = element.props
    .filter(isDirective)
    .find((directive) => directive.name === DIRECTIVE_MODEL && !directive.arg)

  return vModel ?? findPropAttribute(element, MODEL_VALUE_ATTRIBUTE)?.node
}

const startsAsEmptyString = (modelPath: string, scriptSource: string): boolean => {
  const name = modelPath.trim().split(MODEL_PATH_SEPARATOR).at(-1) ?? ''
  const escapedName = name.replaceAll(REGEX_SPECIAL_CHARACTERS, REGEX_ESCAPE_REPLACEMENT)

  return EMPTY_STRING_INITIAL_PATTERNS.some((pattern) =>
    new RegExp(pattern.replace(MODEL_NAME_PLACEHOLDER, escapedName)).test(scriptSource),
  )
}

export const datePickerEmptyStringRule: TemplateRule = {
  id: RULE_DATE_PICKER_EMPTY_STRING,
  fixedIn: SUI_M2_FIXES_VERSION,
  check: ({ element, scriptSource }) => {
    const binding = isOneOfComponentTags(element.tag, DATE_PICKER_EMPTY_STRING_COMPONENTS)
      ? modelBinding(element)
      : undefined

    const source = binding && isDirective(binding) ? expressionSource(binding) : binding?.value?.content

    if (!binding || source === undefined) {
      return []
    }

    const isEmptyLiteral = EMPTY_STRING_EXPRESSION.test(source) || (!isDirective(binding) && source === '')
    const isEmptyInitial = MODEL_PATH_PATTERN.test(source) && startsAsEmptyString(source, scriptSource)

    if (!isEmptyLiteral && !isEmptyInitial) {
      return []
    }

    return [
      {
        ...positionOf(binding),
        rule: RULE_DATE_PICKER_EMPTY_STRING,
        severity: SEVERITY_WARNING,
        message: isEmptyLiteral
          ? `\`${element.tag}\` gets \`''\` as its value: the picker opens on "Invalid date" and a grid of NaN.`
          : `\`${source}\` starts as \`''\` and is bound to \`${element.tag}\`: the picker opens on "Invalid date" and a grid of NaN.`,
        fixHint: 'Start an empty date as `null` (type the model `string | null`); `\'\'` is not treated as "no date".',
        recipe: RECIPE_VALIDATED_FORM,
      },
    ]
  },
}

export const paginationLengthRowsRule: TemplateRule = {
  id: RULE_PAGINATION_LENGTH_ROWS,
  check: ({ element }) => {
    const length = isComponentTag(element.tag, PAGINATION_COMPONENT)
      ? findPropAttribute(element, PAGINATION_LENGTH_ATTRIBUTE)
      : undefined

    const source = length && isDirective(length.node) ? expressionSource(length.node) : undefined

    if (
      !length ||
      source === undefined ||
      !PAGINATION_ROW_COUNT_EXPRESSION.test(source) ||
      PAGINATION_PAGE_MATH_EXPRESSION.test(source)
    ) {
      return []
    }

    return [
      {
        ...positionOf(length.node),
        rule: RULE_PAGINATION_LENGTH_ROWS,
        severity: SEVERITY_WARNING,
        message: `\`:length="${source}"\` on \`SPagination\` looks like a number of rows, but \`length\` is the number of pages: it would show one page per row.`,
        fixHint:
          'Pass the page count: `const pageCount = computed(() => Math.ceil(totalItems.value / itemsPerPage))`, then `<SPagination v-model="page" :length="pageCount" />`.',
      },
    ]
  },
}

export const paginationZeroBasedRule: TemplateRule = {
  id: RULE_PAGINATION_ZERO_BASED,
  check: ({ element }) => {
    const binding = isComponentTag(element.tag, PAGINATION_COMPONENT) ? modelBinding(element) : undefined
    const source = binding && isDirective(binding) ? expressionSource(binding) : undefined
    const lastSegment = source?.trim().split(MODEL_PATH_SEPARATOR).at(-1)

    if (
      !binding ||
      !source ||
      !MODEL_PATH_PATTERN.test(source) ||
      !PAGINATION_ZERO_BASED_MODEL.test(lastSegment ?? '')
    ) {
      return []
    }

    return [
      {
        ...positionOf(binding),
        rule: RULE_PAGINATION_ZERO_BASED,
        severity: SEVERITY_WARNING,
        message: `\`${source}\` looks like a 0-based index (such as STable's \`pageIndex\`), but \`SPagination\`'s \`v-model\` is the page number starting at 1: page 1 would show as page 2.`,
        fixHint:
          'Keep a 1-based `page` ref for SPagination and derive the index where you need it: `const pageIndex = computed(() => page.value - 1)`.',
      },
    ]
  },
}

/** Rules about behaviour and styling misuses that the component API alone cannot catch. */
export const fillHeightUnderAppRule: TemplateRule = {
  id: RULE_FILL_HEIGHT_UNDER_APP,
  fixedIn: SUI_M2_FIXES_VERSION,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, APP_COMPONENT)) {
      return []
    }

    return childElementsOf(element)
      .filter((child) => staticClassNames(child).includes(HEIGHT_FILL_CLASS))
      .map((child) => ({
        ...positionOf(child),
        rule: RULE_FILL_HEIGHT_UNDER_APP,
        severity: SEVERITY_WARNING,
        message: `\`${HEIGHT_FILL_CLASS}\` on a direct child of \`SApp\` resolves to the content height before @khsura/sui 1.20.0 (SApp only has a min-height), so content centred inside it sticks to the top.`,
        fixHint: 'Upgrade @khsura/sui to 1.20.0 or later, or add `style="min-height: 100dvh"` to this child.',
        recipe: RECIPE_CENTERED_PAGE,
      }))
  },
}

export const behaviourRules: TemplateRule[] = [
  nativeValidationInFormRule,
  hideDetailsHidesLabelRule,
  snackbarActionContrastRule,
  blockButtonsInRowRule,
  fieldButtonRowRule,
  cardTitleTextAlignRule,
  datePickerEmptyStringRule,
  fillHeightUnderAppRule,
  paginationLengthRowsRule,
  paginationZeroBasedRule,
]
