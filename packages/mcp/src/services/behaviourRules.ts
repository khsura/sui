import type { ElementNode } from '@vue/compiler-dom'
import type { TemplateRule } from '../types'
import {
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
  HIDE_DETAILS_ATTRIBUTE,
  HIDE_DETAILS_LABEL_COMPONENTS,
  INPUT_TYPE_ATTRIBUTE,
  INPUT_TYPE_NUMBER,
  LABEL_ATTRIBUTE,
  MIN_BLOCK_BUTTONS_IN_ROW,
  MODEL_NAME_PLACEHOLDER,
  MODEL_PATH_PATTERN,
  MODEL_PATH_SEPARATOR,
  MODEL_VALUE_ATTRIBUTE,
  NATIVE_VALIDATING_INPUT_TYPES,
  NO_VALIDATE_ATTRIBUTE,
  RECIPE_ACTIVATOR_OVERLAYS,
  RECIPE_RESPONSIVE_GRID,
  RECIPE_VALIDATED_FORM,
  REGEX_ESCAPE_REPLACEMENT,
  REGEX_SPECIAL_CHARACTERS,
  RULE_BLOCK_BUTTONS_IN_ROW,
  RULE_CARD_TITLE_TEXT_ALIGN,
  RULE_DATE_PICKER_EMPTY_STRING,
  RULE_HIDE_DETAILS_HIDES_LABEL,
  RULE_NATIVE_VALIDATION_IN_FORM,
  RULE_SNACKBAR_ACTION_CONTRAST,
  RULE_TARGET_ANY_ELEMENT,
  SEVERITY_WARNING,
  SNACKBAR_ACTION_SLOT_NAME,
  SNACKBAR_COMPONENT,
  SNACKBAR_READABLE_ACTION_COLOR,
  SNACKBAR_UNREADABLE_PRESET_COLORS,
  STYLE_ATTRIBUTE,
  TEXT_ALIGN_CLASS_PATTERN,
  TEXT_ALIGN_JUSTIFY_CLASSES,
  TEXT_BUTTON_VARIANT,
  VARIANT_ATTRIBUTE,
} from '../constants'
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

const isUnreadableSnackbarAction = (button: ElementNode): boolean => {
  const color = findAttribute(button, COLOR_ATTRIBUTE)?.staticValue
  const variant = findAttribute(button, VARIANT_ATTRIBUTE)?.staticValue

  return (
    isComponentTag(button.tag, BUTTON_COMPONENT) &&
    variant === TEXT_BUTTON_VARIANT &&
    color !== undefined &&
    SNACKBAR_UNREADABLE_PRESET_COLORS.includes(color)
  )
}

export const snackbarActionContrastRule: TemplateRule = {
  id: RULE_SNACKBAR_ACTION_CONTRAST,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, SNACKBAR_COMPONENT)) {
      return []
    }

    return slotFills(element)
      .filter((fill) => staticArgument(fill.directive.arg) === SNACKBAR_ACTION_SLOT_NAME)
      .flatMap((fill) => descendantElementsOf(fill.owner))
      .filter(isUnreadableSnackbarAction)
      .map((button) => {
        const color = findAttribute(button, COLOR_ATTRIBUTE)?.staticValue ?? ''

        return {
          ...positionOf(button),
          rule: RULE_SNACKBAR_ACTION_CONTRAST,
          severity: SEVERITY_WARNING,
          message: `A \`color="${color}"\` text button in the \`SSnackbar\` action is below 4.5:1 on the dark snackbar background, so the action is hard to read.`,
          fixHint: `Use a light colour: \`color="${SNACKBAR_READABLE_ACTION_COLOR}"\` or a CSS colour such as \`color="#ffffff"\`.`,
          recipe: RECIPE_ACTIVATOR_OVERLAYS,
        }
      })
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

export const cardTitleTextAlignRule: TemplateRule = {
  id: RULE_CARD_TITLE_TEXT_ALIGN,
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

/** Rules about behaviour and styling misuses that the component API alone cannot catch. */
export const behaviourRules: TemplateRule[] = [
  nativeValidationInFormRule,
  hideDetailsHidesLabelRule,
  snackbarActionContrastRule,
  blockButtonsInRowRule,
  cardTitleTextAlignRule,
  datePickerEmptyStringRule,
]
