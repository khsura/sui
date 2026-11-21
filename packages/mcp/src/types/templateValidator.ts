import type { SuiApi } from '@khsura/shared/types'
import type { AttributeNode, DirectiveNode, ElementNode, RootNode } from '@vue/compiler-dom'
import type { SEVERITY_ERROR, SEVERITY_WARNING } from '../constants'
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

/** What a rule sees for one SUI-looking element (`S*` or `s-*` tag). */
export interface TemplateRuleContext {
  element: ElementNode
  lookup: ComponentLookup
  api: SuiApi
}

/** A framework-neutral check: the MCP tool runs it today, an eslint plugin can run the same list later. */
export interface TemplateRule {
  id: string
  check: (context: TemplateRuleContext) => TemplateIssue[]
}

/** A prop-like binding on an element: a static attribute or a `:prop` with a static name. */
export interface TemplatePropBinding {
  name: string
  node: AttributeNode | DirectiveNode
  /** The value when it is known statically (`size="small"` or `:size="'small'"`). */
  staticValue?: string
}
