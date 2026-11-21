import type { SuiApi } from '@khsura/shared/types'
import type { ElementNode, ParentNode } from '@vue/compiler-dom'
import { NodeTypes } from '@vue/compiler-dom'
import type { TemplateIssue, TemplateParseError, TemplateRule } from '../types'
import { RULE_PARSE_ERROR, SEVERITY_ERROR } from '../constants'
import { parseVueTemplate } from '../lib'
import { isSuiComponentTag } from '../utils'
import { useComponentCatalogService } from './componentCatalog'
import { templateRules } from './templateRules'

const childElements = (parent: ParentNode): ElementNode[] =>
  parent.children.flatMap((child) => (child.type === NodeTypes.ELEMENT ? [child, ...childElements(child)] : []))

const parseErrorIssue = (error: TemplateParseError): TemplateIssue => ({
  line: error.line,
  column: error.column,
  rule: RULE_PARSE_ERROR,
  severity: SEVERITY_ERROR,
  message: error.message,
  fixHint: 'Fix the template syntax; the other checks may miss problems until it parses cleanly.',
})

const byPosition = (left: TemplateIssue, right: TemplateIssue): number =>
  left.line - right.line || left.column - right.column

/** Validates SUI usage in a `.vue` SFC or template fragment against one `sui-api.json`. */
export const useTemplateValidatorService = (api: SuiApi, rules: TemplateRule[] = templateRules) => {
  const catalog = useComponentCatalogService(api)

  const validate = (code: string): TemplateIssue[] => {
    const { root, errors } = parseVueTemplate(code)
    const elements = root ? childElements(root) : []

    const ruleIssues = elements
      .filter((element) => isSuiComponentTag(element.tag))
      .flatMap((element) => {
        const context = { element, lookup: catalog.findComponent(element.tag), api }

        return rules.flatMap((rule) => rule.check(context))
      })

    return [...errors.map(parseErrorIssue), ...ruleIssues].sort(byPosition)
  }

  return { validate }
}
