import type { SuiApi } from '@khsura/shared/types'
import type { AttributeNode, DirectiveNode, ElementNode, RootNode } from '@vue/compiler-dom'
import type { RULE_TARGET_ANY_ELEMENT, RULE_TARGET_SUI_COMPONENT, SEVERITY_ERROR, SEVERITY_WARNING } from '../constants'
import type { ComponentLookup } from './componentCatalog'

export type TemplateIssueSeverity = typeof SEVERITY_ERROR | typeof SEVERITY_WARNING

/** One problem found in a template; `line` and `column` are 1-based positions in the submitted code. */
export interface TemplateIssue {
  line: number
  column: number
  rule: string
  severity: TemplateIssueSeverity
  message: string
  fixHint: string
  /** Name of the recipe that shows the correct pattern (`validated-form`, `app-shell`, …). */
  recipe?: string
}

export interface TemplateParseError {
  line: number
  column: number
  message: string
}

export interface ParsedTemplate {
  /** The template root, or `null` when the code is an SFC without a `<template>` block. */
  root: RootNode | null
  errors: TemplateParseError[]
}

export type TemplateRuleTarget = typeof RULE_TARGET_SUI_COMPONENT | typeof RULE_TARGET_ANY_ELEMENT

/** What a rule sees for one element: an SUI-looking one (`S*` or `s-*` tag), or any element for an `any-element` rule. */
export interface TemplateRuleContext {
  element: ElementNode
  /** Enclosing elements, outermost first. */
  ancestors: ElementNode[]
  /** The catalog lookup for the tag; never found for a native element. */
  lookup: ComponentLookup
  api: SuiApi
}

/** A framework-neutral check: the MCP tool runs it today, an eslint plugin can run the same list later. */
export interface TemplateRule {
  id: string
  /** Elements the engine runs the check on; SUI components when omitted. */
  target?: TemplateRuleTarget
  check: (context: TemplateRuleContext) => TemplateIssue[]
}

/** An attribute read from an element as a static attribute or a `:name` binding. */
export interface TemplateAttribute {
  node: AttributeNode | DirectiveNode
  /** The value when it is known statically; `undefined` for a bound expression or a valueless attribute. */
  staticValue?: string
  isBound: boolean
}

/** A prop-like binding on an element: a static attribute or a `:prop` with a static name. */
export interface TemplatePropBinding {
  name: string
  node: AttributeNode | DirectiveNode
  /** The value when it is known statically (`size="small"` or `:size="'small'"`). */
  staticValue?: string
}

/** A slot directive and the element that carries it (a `<template>` child, or the component itself); its children are the slot content. */
export interface TemplateSlotFill {
  directive: DirectiveNode
  owner: ElementNode
}
