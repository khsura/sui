import type { AttributeNode, DirectiveNode, ElementNode, ExpressionNode } from '@vue/compiler-dom'
import { NodeTypes } from '@vue/compiler-dom'
import type { TemplateAttribute, TemplateIssue, TemplateSlotFill } from '../types'
import {
  CLASS_ATTRIBUTE,
  DIRECTIVE_BIND,
  DIRECTIVE_SLOT,
  FALSE_LITERAL,
  STRING_LITERAL_EXPRESSION,
  TEMPLATE_TAG,
  WHITESPACE_PATTERN,
} from '../constants'
import { toCamelCase } from '../lib'
import { toComponentKey } from './componentName'

type IssueAt = Pick<TemplateIssue, 'line' | 'column'>

export const positionOf = (node: { loc: { start: { line: number; column: number } } }): IssueAt => ({
  line: node.loc.start.line,
  column: node.loc.start.column,
})

export const codeList = (names: string[]): string => names.map((name) => `\`${name}\``).join(', ')

/** The argument of a directive when it is a static name (`:size`, `#header`); `undefined` for none or `[dynamic]`. */
export const staticArgument = (argument: ExpressionNode | undefined): string | undefined =>
  argument?.type === NodeTypes.SIMPLE_EXPRESSION && argument.isStatic ? argument.content : undefined

/** The source of a directive's value (`on` in `v-on="on"`), trimmed; `undefined` when it has none. */
export const expressionSource = (directive: DirectiveNode): string | undefined => {
  const source = directive.exp?.loc.source.trim() ?? ''

  return source.length ? source : undefined
}

export const isDirective = (prop: AttributeNode | DirectiveNode): prop is DirectiveNode =>
  prop.type === NodeTypes.DIRECTIVE

/** True when `tag` names `componentName` in either case style: `SAppBar`, `s-app-bar`. */
export const isComponentTag = (tag: string, componentName: string): boolean =>
  toComponentKey(tag) === toComponentKey(componentName)

export const isOneOfComponentTags = (tag: string, componentNames: readonly string[]): boolean =>
  componentNames.some((componentName) => isComponentTag(tag, componentName))

export const childElementsOf = (element: ElementNode): ElementNode[] =>
  element.children.filter((child): child is ElementNode => child.type === NodeTypes.ELEMENT)

/** `name="x"` or `:name="x"` / `v-bind:name="x"` on `element`; a quoted literal binding still has a static value. */
export const findAttribute = (element: ElementNode, name: string): TemplateAttribute | undefined => {
  for (const prop of element.props) {
    if (!isDirective(prop)) {
      if (prop.name === name) {
        return { node: prop, staticValue: prop.value?.content, isBound: false }
      }

      continue
    }

    if (prop.name === DIRECTIVE_BIND && staticArgument(prop.arg) === name) {
      const literal = STRING_LITERAL_EXPRESSION.exec(expressionSource(prop) ?? '')

      return { node: prop, staticValue: literal?.[2], isBound: !literal }
    }
  }

  return undefined
}

/** `v-bind="object"`: it may carry any attribute, so presence checks cannot be sure. */
export const hasObjectSpread = (element: ElementNode): boolean =>
  element.props.some((prop) => isDirective(prop) && prop.name === DIRECTIVE_BIND && !prop.arg)

/** Slots `element` fills: `v-slot` / `#name` on the element itself or on its direct `<template>` children. */
export const slotFills = (element: ElementNode): TemplateSlotFill[] => {
  const templateChildren = childElementsOf(element).filter((child) => child.tag === TEMPLATE_TAG)

  return [element, ...templateChildren].flatMap((owner) =>
    owner.props
      .filter(isDirective)
      .filter((directive) => directive.name === DIRECTIVE_SLOT)
      .map((directive) => ({ directive, owner })),
  )
}

export const slotDirectives = (element: ElementNode): DirectiveNode[] =>
  slotFills(element).map((fill) => fill.directive)

/** True when `element` has content between its tags (elements, text or `{{ }}`), not counting comments. */
export const hasChildContent = (element: ElementNode): boolean =>
  element.children.some(
    (child) => child.type !== NodeTypes.COMMENT && (child.type !== NodeTypes.TEXT || child.content.trim() !== ''),
  )

/** Every element below `element`, depth first. */
export const descendantElementsOf = (element: ElementNode): ElementNode[] =>
  childElementsOf(element).flatMap((child) => [child, ...descendantElementsOf(child)])

/** A prop written in either case style: `hide-details`, `hideDetails`, `:hide-details`. */
export const findPropAttribute = (element: ElementNode, kebabName: string): TemplateAttribute | undefined =>
  findAttribute(element, kebabName) ?? findAttribute(element, toCamelCase(kebabName))

/** A boolean prop that is set and not statically `false` (`block`, `:block="true"`, `:block="isWide"`). */
export const isBooleanPropOn = (element: ElementNode, kebabName: string): boolean => {
  const attribute = findPropAttribute(element, kebabName)

  if (!attribute) {
    return false
  }

  return !isDirective(attribute.node) || expressionSource(attribute.node) !== FALSE_LITERAL
}

/** The static `class` tokens of `element` (a plain `class` or a string-literal `:class`); bound classes are unknown. */
export const staticClassNames = (element: ElementNode): string[] =>
  element.props
    .flatMap((prop) => {
      if (!isDirective(prop)) {
        return prop.name === CLASS_ATTRIBUTE ? [prop.value?.content ?? ''] : []
      }

      const isClassBinding = prop.name === DIRECTIVE_BIND && staticArgument(prop.arg) === CLASS_ATTRIBUTE
      const literal = isClassBinding ? STRING_LITERAL_EXPRESSION.exec(expressionSource(prop) ?? '') : null

      return literal ? [literal[2]] : []
    })
    .flatMap((value) => value.split(WHITESPACE_PATTERN))
    .filter(Boolean)
