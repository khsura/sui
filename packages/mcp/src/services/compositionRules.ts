import type { ElementNode } from '@vue/compiler-dom'
import { NodeTypes } from '@vue/compiler-dom'
import type { SuiApi } from '@khsura/shared/types'
import type { TemplateIssue, TemplateRule, TemplateSlotFill } from '../types'
import {
  ACCESSIBLE_LABEL_ATTRIBUTES,
  ACTIVATOR_ATTRS_KEY,
  ACTIVATOR_BINDING_FIX,
  ACTIVATOR_ON_KEY,
  ACTIVATOR_SLOT_NAME,
  AVATAR_COMPONENT,
  AVATAR_GROUP_COMPONENT,
  AVATAR_GROUP_PASSTHROUGH_TAGS,
  AVATAR_SLOT_IMAGE_TAGS,
  BUTTON_COMPONENT,
  DIRECTIVE_SLOT,
  DIALOG_TAG,
  EMPTY_STATE_COMPONENT,
  CHANGE_EVENT,
  FILE_INPUT_COMPONENT,
  FILE_INPUT_EXAMPLE,
  FILE_INPUT_TYPE,
  MEMBER_PATH_SEPARATOR_PATTERN,
  NATIVE_CHANGE_EVENT_ACCESS_PATTERN,
  PICKER_CLICK_CALL_PATTERN,
  REF_ATTRIBUTE,
  RULE_FILE_INPUT_CHANGE_EVENT,
  RULE_RAW_FILE_INPUT,
  DIRECTIVE_BIND,
  DIRECTIVE_ON,
  FORM_COMPONENT,
  ICON_COMPONENT,
  IMAGE_SOURCE_ATTRIBUTE,
  INPUT_TAG,
  INPUT_TYPE_ATTRIBUTE,
  INPUT_TYPE_NUMBER,
  LAYOUT_APP_ATTRIBUTE,
  LAYOUT_CHILD_COMPONENTS,
  LAYOUT_COMPONENT,
  LAYOUT_FOR_ATTRIBUTE,
  LAYOUT_NAME_ATTRIBUTE,
  NO_DATA_SLOT_COMPONENTS,
  NO_DATA_SLOT_NAME,
  NON_VISUAL_INPUT_TYPES,
  NUMBER_INPUT_COMPONENT,
  RAW_INPUT_TYPE_REPLACEMENTS,
  RAW_TAG_REPLACEMENTS,
  RECIPE_ACTIVATOR_OVERLAYS,
  RECIPE_APP_SHELL,
  RECIPE_VALIDATED_FORM,
  RULE_ACTIVATOR_BINDING,
  RULE_AVATAR_GROUP_CHILD,
  RULE_AVATAR_IMAGE_IN_SLOT,
  RULE_EMPTY_STATE_OUTSIDE_NO_DATA_SLOT,
  RULE_FORM_RULES_OUTSIDE_FORM,
  RULE_ICON_BUTTON_LABEL,
  RULE_LAYOUT_FOR,
  RULE_NO_RAW_REPLACEMENT,
  RULE_TARGET_ANY_ELEMENT,
  RULES_ATTRIBUTE,
  SEVERITY_ERROR,
  SEVERITY_WARNING,
  SLOT_PROP_ACTIVATOR_COMPONENTS,
  SLOTLESS_ACTIVATOR_COMPONENTS,
  TEMPLATE_TAG,
  WHITESPACE_PATTERN,
} from '../constants'
import { slotPropAccessor } from '../lib'
import {
  childElementsOf,
  descendantElementsOf,
  expressionSource,
  findAttribute,
  hasObjectSpread,
  hasSuiComponent,
  isComponentTag,
  isDirective,
  isOneOfComponentTags,
  positionOf,
  slotFills,
  staticArgument,
} from '../utils'

type IssueBase = Pick<TemplateIssue, 'rule' | 'severity' | 'recipe'>

const compactExpression = (source: string): string => source.replaceAll(WHITESPACE_PATTERN, '')

/** Values of the argument-less `v-on="…"` or `v-bind="…"` directives on `element`, whitespace removed. */
const objectBindings = (element: ElementNode, directiveName: string): string[] =>
  element.props
    .filter(isDirective)
    .filter((directive) => directive.name === directiveName && !directive.arg)
    .flatMap((directive) => {
      const source = expressionSource(directive)

      return source ? [compactExpression(source)] : []
    })

const isActivatorFill = (fill: TemplateSlotFill): boolean => staticArgument(fill.directive.arg) === ACTIVATOR_SLOT_NAME

const missingActivatorBindings = (fill: TemplateSlotFill, componentTag: string): TemplateIssue[] => {
  const pattern = expressionSource(fill.directive)
  const base: IssueBase = { rule: RULE_ACTIVATOR_BINDING, severity: SEVERITY_ERROR, recipe: RECIPE_ACTIVATOR_OVERLAYS }

  if (!pattern) {
    return [
      {
        ...positionOf(fill.directive),
        ...base,
        message: `The \`${componentTag}\` activator slot ignores its \`{ on, attrs }\` slot props, so clicking it cannot open the overlay.`,
        fixHint: ACTIVATOR_BINDING_FIX,
      },
    ]
  }

  const onExpression = slotPropAccessor(pattern, ACTIVATOR_ON_KEY)
  const attrsExpression = slotPropAccessor(pattern, ACTIVATOR_ATTRS_KEY)
  const roots = childElementsOf(fill.owner)

  const bindsOn = (root: ElementNode): boolean =>
    onExpression !== undefined && objectBindings(root, DIRECTIVE_ON).includes(compactExpression(onExpression))

  const bindsAttrs = (root: ElementNode): boolean =>
    attrsExpression !== undefined && objectBindings(root, DIRECTIVE_BIND).includes(compactExpression(attrsExpression))

  const activatorRoot = roots.find((root) => bindsOn(root) || bindsAttrs(root)) ?? roots.at(0)

  const missing = [
    ...(activatorRoot && bindsOn(activatorRoot) ? [] : [`v-on="${onExpression ?? ACTIVATOR_ON_KEY}"`]),
    ...(activatorRoot && bindsAttrs(activatorRoot) ? [] : [`v-bind="${attrsExpression ?? ACTIVATOR_ATTRS_KEY}"`]),
  ]

  if (!missing.length) {
    return []
  }

  const notExposed = onExpression === undefined || attrsExpression === undefined

  return [
    {
      ...positionOf(activatorRoot ?? fill.directive),
      ...base,
      message: `The \`${componentTag}\` activator element is missing ${missing.map((binding) => `\`${binding}\``).join(' and ')}; with only one of the pair the overlay does not open or stays out of sync.`,
      fixHint: notExposed
        ? `The slot pattern \`${pattern}\` does not expose both \`on\` and \`attrs\`. ${ACTIVATOR_BINDING_FIX}`
        : `Bind ${missing.map((binding) => `\`${binding}\``).join(' and ')} on the same root element as the other binding.`,
    },
  ]
}

const tooltipSlotPropsIssue = (fill: TemplateSlotFill, componentTag: string): TemplateIssue[] =>
  expressionSource(fill.directive)
    ? [
        {
          ...positionOf(fill.directive),
          rule: RULE_ACTIVATOR_BINDING,
          severity: SEVERITY_WARNING,
          message: `\`${componentTag}\` passes no activator slot props, so \`on\` / \`attrs\` are undefined here.`,
          fixHint: `Write \`<template #activator>\` without slot props and do not bind \`v-on\` / \`v-bind\`: ${componentTag} wraps the activator in its own element that listens for hover and click.`,
          recipe: RECIPE_ACTIVATOR_OVERLAYS,
        },
      ]
    : []

export const activatorBindingRule: TemplateRule = {
  id: RULE_ACTIVATOR_BINDING,
  check: ({ element }) => {
    const activatorFills = slotFills(element).filter(isActivatorFill)

    if (isOneOfComponentTags(element.tag, SLOT_PROP_ACTIVATOR_COMPONENTS)) {
      return activatorFills.flatMap((fill) => missingActivatorBindings(fill, element.tag))
    }

    if (isOneOfComponentTags(element.tag, SLOTLESS_ACTIVATOR_COMPONENTS)) {
      return activatorFills.flatMap((fill) => tooltipSlotPropsIssue(fill, element.tag))
    }

    return []
  },
}

export const layoutForRule: TemplateRule = {
  id: RULE_LAYOUT_FOR,
  check: ({ element, ancestors }) => {
    if (!isOneOfComponentTags(element.tag, LAYOUT_CHILD_COMPONENTS) || findAttribute(element, LAYOUT_APP_ATTRIBUTE)) {
      return []
    }

    const forAttribute = findAttribute(element, LAYOUT_FOR_ATTRIBUTE)

    const layoutNames = ancestors
      .filter((ancestor) => isComponentTag(ancestor.tag, LAYOUT_COMPONENT))
      .map((layout) => findAttribute(layout, LAYOUT_NAME_ATTRIBUTE))

    // No enclosing SLayout here (it lives in a parent file), or a name or `for` known only at runtime: nothing to compare.
    if (!layoutNames.length || forAttribute?.isBound || layoutNames.some((name) => name?.isBound)) {
      return []
    }

    const nearestName = layoutNames.at(-1)?.staticValue
    const base: IssueBase = { rule: RULE_LAYOUT_FOR, severity: SEVERITY_ERROR, recipe: RECIPE_APP_SHELL }

    if (!forAttribute) {
      return nearestName
        ? [
            {
              ...positionOf(element),
              ...base,
              message: `\`${element.tag}\` has no \`for\`, so it joins the app-level layout instead of \`SLayout name="${nearestName}"\` and the layout offsets break.`,
              fixHint: `Add \`for="${nearestName}"\`.`,
            },
          ]
        : []
    }

    const forValue = forAttribute.staticValue ?? ''
    const staticNames = layoutNames.flatMap((name) => (name?.staticValue ? [name.staticValue] : []))

    if (staticNames.includes(forValue)) {
      return []
    }

    return [
      {
        ...positionOf(forAttribute.node),
        ...base,
        message: `\`for="${forValue}"\` on \`${element.tag}\` matches no enclosing \`SLayout name\`, so it is not placed in the layout.`,
        fixHint: nearestName
          ? `Use \`for="${nearestName}"\`.`
          : `Remove \`for\` to join the enclosing app-level layout, or give that SLayout \`name="${forValue}"\`.`,
      },
    ]
  },
}

export const formRulesOutsideFormRule: TemplateRule = {
  id: RULE_FORM_RULES_OUTSIDE_FORM,
  check: ({ element, ancestors }) => {
    const rulesAttribute = findAttribute(element, RULES_ATTRIBUTE)

    if (!rulesAttribute || ancestors.some((ancestor) => isComponentTag(ancestor.tag, FORM_COMPONENT))) {
      return []
    }

    return [
      {
        ...positionOf(rulesAttribute.node),
        rule: RULE_FORM_RULES_OUTSIDE_FORM,
        severity: SEVERITY_WARNING,
        message: `\`${element.tag}\` has \`rules\` but no enclosing \`SForm\`; rules only run when the value changes, so an untouched field passes on submit.`,
        fixHint: 'Wrap the inputs in `<SForm ref="form">` and call `form.validate()` before submitting.',
        recipe: RECIPE_VALIDATED_FORM,
      },
    ]
  },
}

const isBlankText = (node: ElementNode['children'][number]): boolean =>
  node.type === NodeTypes.COMMENT || (node.type === NodeTypes.TEXT && !node.content.trim())

const hasAccessibleLabel = (element: ElementNode): boolean =>
  ACCESSIBLE_LABEL_ATTRIBUTES.some((name) => findAttribute(element, name)) || hasObjectSpread(element)

export const iconButtonLabelRule: TemplateRule = {
  id: RULE_ICON_BUTTON_LABEL,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, BUTTON_COMPONENT) || hasAccessibleLabel(element)) {
      return []
    }

    const content = element.children.filter((child) => !isBlankText(child))
    const [onlyChild] = content

    const isIconOnly =
      content.length === 1 && onlyChild.type === NodeTypes.ELEMENT && isComponentTag(onlyChild.tag, ICON_COMPONENT)

    return isIconOnly
      ? [
          {
            ...positionOf(element),
            rule: RULE_ICON_BUTTON_LABEL,
            severity: SEVERITY_WARNING,
            message: `This \`${element.tag}\` shows only an \`SIcon\`, so screen readers announce it without a name.`,
            fixHint: 'Add `aria-label="…"` (or `title`) describing the action.',
            recipe: RECIPE_APP_SHELL,
          },
        ]
      : []
  },
}

const rawReplacement = (element: ElementNode, api: SuiApi): string | undefined => {
  if (element.tag !== INPUT_TAG) {
    return RAW_TAG_REPLACEMENTS.get(element.tag)
  }

  const inputType = findAttribute(element, INPUT_TYPE_ATTRIBUTE)?.staticValue?.toLowerCase()

  // A file input is `raw-file-input`'s: SInput is no replacement for it.
  if (inputType && (NON_VISUAL_INPUT_TYPES.includes(inputType) || inputType === FILE_INPUT_TYPE)) {
    return undefined
  }

  // SNumberInput only for a release that has it; an older one keeps SInput type="number".
  if (inputType === INPUT_TYPE_NUMBER && hasSuiComponent(api, NUMBER_INPUT_COMPONENT)) {
    return NUMBER_INPUT_COMPONENT
  }

  return (inputType ? RAW_INPUT_TYPE_REPLACEMENTS.get(inputType) : undefined) ?? RAW_TAG_REPLACEMENTS.get(INPUT_TAG)
}

export const noRawReplacementRule: TemplateRule = {
  id: RULE_NO_RAW_REPLACEMENT,
  target: RULE_TARGET_ANY_ELEMENT,
  check: ({ element, api }) => {
    const replacement = rawReplacement(element, api)

    if (!replacement) {
      return []
    }

    return [
      {
        ...positionOf(element),
        rule: RULE_NO_RAW_REPLACEMENT,
        severity: SEVERITY_WARNING,
        message: `Raw \`<${element.tag}>\` bypasses SUI theming, sizing and validation.`,
        fixHint: `Use \`${replacement}\` instead.`,
        recipe: element.tag === DIALOG_TAG ? RECIPE_ACTIVATOR_OVERLAYS : RECIPE_VALIDATED_FORM,
      },
    ]
  },
}

const isFileInputElement = (element: ElementNode): boolean =>
  element.tag === INPUT_TAG &&
  findAttribute(element, INPUT_TYPE_ATTRIBUTE)?.staticValue?.toLowerCase() === FILE_INPUT_TYPE

/** Whether a listener in `scope` opens the picker through the ref: `@click="fileInput?.click()"`. */
const opensPickerThroughRef = (scope: ElementNode, refName: string): boolean =>
  [scope, ...descendantElementsOf(scope)].some((candidate) =>
    candidate.props.some((prop) => {
      if (!isDirective(prop) || prop.name !== DIRECTIVE_ON) {
        return false
      }

      return [...(expressionSource(prop) ?? '').matchAll(PICKER_CLICK_CALL_PATTERN)].some(([call]) =>
        call.split(MEMBER_PATH_SEPARATOR_PATTERN).includes(refName),
      )
    }),
  )

/**
 * A raw `<input type="file">`, often hidden and opened by a button's `ref.click()`. Only for a `@khsura/sui`
 * whose API has SFileInput, so a project on an older release is not told to use a component it lacks.
 */
export const rawFileInputRule: TemplateRule = {
  id: RULE_RAW_FILE_INPUT,
  target: RULE_TARGET_ANY_ELEMENT,
  check: ({ element, ancestors, api }) => {
    if (!isFileInputElement(element) || !api.components.some((component) => component.name === FILE_INPUT_COMPONENT)) {
      return []
    }

    const refName = findAttribute(element, REF_ATTRIBUTE)?.staticValue
    const scope = ancestors[0] ?? element
    const isButtonHack = !!refName && opensPickerThroughRef(scope, refName)

    return [
      {
        ...positionOf(element),
        rule: RULE_RAW_FILE_INPUT,
        severity: SEVERITY_WARNING,
        message: isButtonHack
          ? `A file \`<input>\` opened by a button's \`${refName}.click()\` has no label of its own, skips \`rules\` and the error line, and its chosen file is never shown or announced.`
          : 'A raw `<input type="file">` bypasses SUI theming, its label, `rules` and the error line.',
        fixHint: `Use \`${FILE_INPUT_EXAMPLE}\` (\`variant="dropzone"\` for a drop area). Its model is a \`File[]\` (\`null\` when empty): read \`files?.[0]\` for one file, or watch the model / listen to \`@change\`, which passes the files, not a DOM event.`,
        recipe: RECIPE_VALIDATED_FORM,
      },
    ]
  },
}

/** `@change` on SFileInput passes `File[] | null`; code written for a native input reads `$event.target.files`. */
export const fileInputChangeEventRule: TemplateRule = {
  id: RULE_FILE_INPUT_CHANGE_EVENT,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, FILE_INPUT_COMPONENT)) {
      return []
    }

    return element.props
      .filter(
        (prop) =>
          isDirective(prop) &&
          prop.name === DIRECTIVE_ON &&
          staticArgument(prop.arg) === CHANGE_EVENT &&
          NATIVE_CHANGE_EVENT_ACCESS_PATTERN.test(expressionSource(prop) ?? ''),
      )
      .map((listener) => ({
        ...positionOf(listener),
        rule: RULE_FILE_INPUT_CHANGE_EVENT,
        severity: SEVERITY_ERROR,
        message:
          '`SFileInput` emits `change` with the chosen files (`File[] | null`), not a DOM event, so `.target` / `$event.files` is `undefined`.',
        fixHint:
          'Bind `v-model="files"` and read `files?.[0]`, or take the files from the event: `@change="(files) => upload(files?.[0])"`.',
      }))
  },
}

export const avatarImageInSlotRule: TemplateRule = {
  id: RULE_AVATAR_IMAGE_IN_SLOT,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, AVATAR_COMPONENT)) {
      return []
    }

    return descendantElementsOf(element)
      .filter((child) => isOneOfComponentTags(child.tag, AVATAR_SLOT_IMAGE_TAGS))
      .map((image) => {
        const source = findAttribute(image, IMAGE_SOURCE_ATTRIBUTE)

        const imageBinding =
          source && isDirective(source.node)
            ? `:image="${expressionSource(source.node) ?? ''}"`
            : `image="${source?.staticValue ?? '…'}"`

        return {
          ...positionOf(image),
          rule: RULE_AVATAR_IMAGE_IN_SLOT,
          severity: SEVERITY_WARNING,
          message: `\`<${image.tag}>\` inside \`SAvatar\` replaces the avatar's own image: when it fails to load, the avatar shows a broken image instead of the initials or the icon.`,
          fixHint: `Pass the URL to the avatar and drop the \`<${image.tag}>\`: \`<SAvatar ${imageBinding} text="JD" alt="Jane Doe" />\`.`,
        }
      })
  },
}

const isSlotFillTemplate = (template: ElementNode): boolean =>
  template.props.filter(isDirective).some((directive) => directive.name === DIRECTIVE_SLOT)

/** Children the group cannot overlap or count as one avatar: anything but SAvatar or a passthrough `<slot>`, looking through `<template v-for>`. */
const strayAvatarGroupChildren = (element: ElementNode): ElementNode[] =>
  childElementsOf(element).flatMap((child) => {
    if (child.tag === TEMPLATE_TAG) {
      return isSlotFillTemplate(child) ? [] : strayAvatarGroupChildren(child)
    }

    return isComponentTag(child.tag, AVATAR_COMPONENT) || AVATAR_GROUP_PASSTHROUGH_TAGS.includes(child.tag)
      ? []
      : [child]
  })

export const avatarGroupChildRule: TemplateRule = {
  id: RULE_AVATAR_GROUP_CHILD,
  check: ({ element }) => {
    if (!isComponentTag(element.tag, AVATAR_GROUP_COMPONENT)) {
      return []
    }

    return strayAvatarGroupChildren(element).map((child) => ({
      ...positionOf(child),
      rule: RULE_AVATAR_GROUP_CHILD,
      severity: SEVERITY_WARNING,
      message: `\`<${child.tag}>\` is a direct child of \`SAvatarGroup\`: the group only overlaps and rings \`SAvatar\` children, so a wrapper breaks the overlap and counts as one avatar for \`max\`.`,
      fixHint:
        'Put each `SAvatar` directly in the group: `<SAvatar v-for="member in members" :key="member.id" :image="member.photoUrl" :alt="member.name" />`. For a tooltip or a link, wrap the whole group, not each avatar.',
    }))
  },
}

/** Elements in the default slot of `element`: its children outside a `#slot` template, looking through plain `<template>`s. */
const defaultSlotElements = (element: ElementNode): ElementNode[] =>
  childElementsOf(element).flatMap((child) => {
    if (child.tag === TEMPLATE_TAG) {
      return isSlotFillTemplate(child) ? [] : defaultSlotElements(child)
    }

    return [child, ...descendantElementsOf(child)]
  })

export const emptyStateOutsideNoDataSlotRule: TemplateRule = {
  id: RULE_EMPTY_STATE_OUTSIDE_NO_DATA_SLOT,
  check: ({ element }) => {
    if (!isOneOfComponentTags(element.tag, NO_DATA_SLOT_COMPONENTS)) {
      return []
    }

    return defaultSlotElements(element)
      .filter((child) => isComponentTag(child.tag, EMPTY_STATE_COMPONENT))
      .map((emptyState) => ({
        ...positionOf(emptyState),
        rule: RULE_EMPTY_STATE_OUTSIDE_NO_DATA_SLOT,
        severity: SEVERITY_ERROR,
        message: `\`SEmptyState\` in the default slot of \`${element.tag}\` is never rendered: its no-data content goes in the \`#${NO_DATA_SLOT_NAME}\` slot.`,
        fixHint: `Wrap it in the slot template: \`<${element.tag} …><template #${NO_DATA_SLOT_NAME}><SEmptyState size="small" icon="mdi-inbox-outline" title="Nothing here yet" /></template></${element.tag}>\`.`,
      }))
  },
}

/** Rules about how components fit together, beyond what one component's API says. */
export const compositionRules: TemplateRule[] = [
  activatorBindingRule,
  layoutForRule,
  formRulesOutsideFormRule,
  iconButtonLabelRule,
  noRawReplacementRule,
  avatarImageInSlotRule,
  avatarGroupChildRule,
  emptyStateOutsideNoDataSlotRule,
  rawFileInputRule,
  fileInputChangeEventRule,
]
