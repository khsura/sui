import type { SuiApiComponent } from '@khsura/shared/types'
import type { AttributeNode, DirectiveNode, ElementNode } from '@vue/compiler-dom'
import { NodeTypes } from '@vue/compiler-dom'
import type { TemplateIssue, TemplatePropBinding, TemplateRule } from '../types'
import {
  DEFAULT_MODEL_PROP,
  DEFAULT_SLOT_NAME,
  DIRECTIVE_BIND,
  DIRECTIVE_MODEL,
  FALLTHROUGH_ATTRIBUTE_PREFIXES,
  FALLTHROUGH_ATTRIBUTES,
  LIST_COMPONENTS_TOOL_NAME,
  LISTENER_ATTRIBUTE_PATTERN,
  MAX_PROP_SUGGESTION_DISTANCE,
  MAX_PROP_SUGGESTIONS,
  RULE_INVALID_ENUM_VALUE,
  RULE_UNKNOWN_COMPONENT,
  RULE_UNKNOWN_PROP,
  RULE_UNKNOWN_SLOT,
  SEVERITY_ERROR,
  STRING_LITERAL_EXPRESSION,
} from '../constants'
import { levenshteinDistance, toCamelCase } from '../lib'
import { codeList, isDirective, positionOf, slotDirectives, staticArgument } from '../utils'
import { behaviourRules } from './behaviourRules'
import { compositionRules } from './compositionRules'

const findProp = (component: SuiApiComponent, attributeName: string) => {
  const camelName = toCamelCase(attributeName)

  return component.props.find((prop) => prop.name === attributeName || prop.name === camelName)
}

const isFallthroughAttribute = (attributeName: string): boolean =>
  FALLTHROUGH_ATTRIBUTES.includes(attributeName.toLowerCase()) ||
  FALLTHROUGH_ATTRIBUTE_PREFIXES.some((prefix) => attributeName.startsWith(prefix)) ||
  LISTENER_ATTRIBUTE_PATTERN.test(attributeName)

const suggestProps = (component: SuiApiComponent, attributeName: string): string[] => {
  const camelName = toCamelCase(attributeName)

  return component.props
    .map((prop) => ({ name: prop.name, distance: levenshteinDistance(camelName, prop.name) }))
    .filter((candidate) => candidate.distance <= MAX_PROP_SUGGESTION_DISTANCE)
    .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
    .slice(0, MAX_PROP_SUGGESTIONS)
    .map((candidate) => candidate.name)
}

/** Props the component can `v-model`: ones it emits `update:<prop>` for. */
const modelProps = (component: SuiApiComponent): string[] =>
  component.props
    .filter((prop) => component.events.some((event) => event.name === `update:${prop.name}`))
    .map((prop) => prop.name)

/** Prop-like bindings on an element: static attributes and `:prop` / `v-bind:prop` with a static name. */
const propBindings = (element: ElementNode): TemplatePropBinding[] =>
  element.props.flatMap((prop): TemplatePropBinding[] => {
    if (!isDirective(prop)) {
      return [{ name: prop.name, node: prop, staticValue: prop.value?.content }]
    }

    const boundName = prop.name === DIRECTIVE_BIND ? staticArgument(prop.arg) : undefined

    if (boundName === undefined) {
      return []
    }

    const literal =
      prop.exp?.type === NodeTypes.SIMPLE_EXPRESSION ? STRING_LITERAL_EXPRESSION.exec(prop.exp.content) : null

    return [{ name: boundName, node: prop, staticValue: literal?.[2] }]
  })

export const unknownComponentRule: TemplateRule = {
  id: RULE_UNKNOWN_COMPONENT,
  check: ({ element, lookup }) => {
    if (lookup.found) {
      return []
    }

    const suggestion = lookup.suggestions.length ? `Did you mean ${codeList(lookup.suggestions)}? ` : ''

    return [
      {
        ...positionOf(element),
        rule: RULE_UNKNOWN_COMPONENT,
        severity: SEVERITY_ERROR,
        message: `\`${element.tag}\` is not a @khsura/sui component.`,
        fixHint: `${suggestion}Check the exact names with ${LIST_COMPONENTS_TOOL_NAME}.`,
      },
    ]
  },
}

const unknownBindingIssue = (
  component: SuiApiComponent,
  name: string,
  node: AttributeNode | DirectiveNode,
): TemplateIssue => {
  const suggestions = suggestProps(component, name)

  return {
    ...positionOf(node),
    rule: RULE_UNKNOWN_PROP,
    severity: SEVERITY_ERROR,
    message: `\`${component.name}\` has no prop \`${name}\`.`,
    fixHint: suggestions.length
      ? `Did you mean ${codeList(suggestions)}?`
      : `Remove it, or use one of: ${codeList(component.props.map((prop) => prop.name))}.`,
  }
}

const unknownModelIssue = (component: SuiApiComponent, modelProp: string, node: DirectiveNode): TemplateIssue => {
  const supported = modelProps(component)

  return {
    ...positionOf(node),
    rule: RULE_UNKNOWN_PROP,
    severity: SEVERITY_ERROR,
    message: `\`${component.name}\` has no \`${modelProp}\` prop, so \`v-model\` has nothing to bind.`,
    fixHint: supported.length
      ? `Bind one of its model props instead: ${supported.map((prop) => (prop === DEFAULT_MODEL_PROP ? '`v-model`' : `\`v-model:${prop}\``)).join(', ')}.`
      : `\`${component.name}\` supports no v-model; remove it.`,
  }
}

export const unknownPropRule: TemplateRule = {
  id: RULE_UNKNOWN_PROP,
  check: ({ element, lookup }) => {
    if (!lookup.found) {
      return []
    }

    const { component } = lookup

    const bindingIssues = propBindings(element)
      .filter((binding) => !findProp(component, binding.name) && !isFallthroughAttribute(binding.name))
      .map((binding) => unknownBindingIssue(component, binding.name, binding.node))

    const modelIssues = element.props.filter(isDirective).flatMap((directive) => {
      if (directive.name !== DIRECTIVE_MODEL) {
        return []
      }

      const modelProp = directive.arg ? staticArgument(directive.arg) : DEFAULT_MODEL_PROP

      return modelProp === undefined || findProp(component, modelProp)
        ? []
        : [unknownModelIssue(component, modelProp, directive)]
    })

    return [...bindingIssues, ...modelIssues]
  },
}

export const invalidEnumValueRule: TemplateRule = {
  id: RULE_INVALID_ENUM_VALUE,
  check: ({ element, lookup }) => {
    if (!lookup.found) {
      return []
    }

    return propBindings(element).flatMap((binding) => {
      const enumValues = findProp(lookup.component, binding.name)?.enumValues

      if (!enumValues || binding.staticValue === undefined || enumValues.includes(binding.staticValue)) {
        return []
      }

      return [
        {
          ...positionOf(binding.node),
          rule: RULE_INVALID_ENUM_VALUE,
          severity: SEVERITY_ERROR,
          message: `\`${binding.staticValue}\` is not a valid \`${binding.name}\` for \`${lookup.component.name}\`.`,
          fixHint: `Use one of: ${codeList(enumValues)}.`,
        },
      ]
    })
  },
}

export const unknownSlotRule: TemplateRule = {
  id: RULE_UNKNOWN_SLOT,
  check: ({ element, lookup }) => {
    // sui-api.json lists every slot (dynamic families such as STable `item.<column>` carry a
    // `pattern`), so an empty list means the component has no slots and any slot is an error.
    if (!lookup.found) {
      return []
    }

    const { slots } = lookup.component
    const slotNames = slots.map((slot) => slot.name)
    const slotPatterns = slots.flatMap((slot) => (slot.pattern ? [new RegExp(slot.pattern)] : []))

    const isKnownSlot = (slotName: string) =>
      slotNames.includes(slotName) || slotPatterns.some((pattern) => pattern.test(slotName))

    return slotDirectives(element).flatMap((directive) => {
      const slotName = directive.arg ? staticArgument(directive.arg) : DEFAULT_SLOT_NAME

      if (slotName === undefined || isKnownSlot(slotName)) {
        return []
      }

      return [
        {
          ...positionOf(directive),
          rule: RULE_UNKNOWN_SLOT,
          severity: SEVERITY_ERROR,
          message: `\`${lookup.component.name}\` has no slot \`${slotName}\`.`,
          fixHint: slotNames.length
            ? `Use one of: ${codeList(slotNames)}.`
            : `\`${lookup.component.name}\` has no slots; put the content elsewhere.`,
        },
      ]
    })
  },
}

/** The rules this validator runs, in order: API checks first, then the composition and behaviour rules. */
export const templateRules: TemplateRule[] = [
  unknownComponentRule,
  unknownPropRule,
  invalidEnumValueRule,
  unknownSlotRule,
  ...compositionRules,
  ...behaviourRules,
]
