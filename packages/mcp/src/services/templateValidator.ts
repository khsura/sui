import type { SuiApi } from '@khsura/shared/types'
import type { ElementNode, ParentNode } from '@vue/compiler-dom'
import { NodeTypes } from '@vue/compiler-dom'
import type { TemplateIssue, TemplateParseError, TemplateRule } from '../types'
import { RULE_PARSE_ERROR, RULE_TARGET_ANY_ELEMENT, SEVERITY_ERROR } from '../constants'
import { parseVueTemplate } from '../lib'
import { isSuiComponentTag } from '../utils'
import { useComponentCatalogService } from './componentCatalog'
import { templateRules } from './templateRules'

interface PlacedElement {
  element: ElementNode
  ancestors: ElementNode[]
}

/** Every element under `parent`, depth first, with its enclosing elements (outermost first). */
const placedElements = (parent: ParentNode, ancestors: ElementNode[] = []): PlacedElement[] =>
  parent.children.flatMap((child) =>
    child.type === NodeTypes.ELEMENT
      ? [{ element: child, ancestors }, ...placedElements(child, [...ancestors, child])]
      : [],
  )

const appliesTo = (rule: TemplateRule, tag: string): boolean =>
  rule.target === RULE_TARGET_ANY_ELEMENT || isSuiComponentTag(tag)

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
    const elements = root ? placedElements(root) : []

    const ruleIssues = elements.flatMap(({ element, ancestors }) => {
      const applicableRules = rules.filter((rule) => appliesTo(rule, element.tag))

      if (!applicableRules.length) {
        return []
      }

      const context = { element, ancestors, lookup: catalog.findComponent(element.tag), api }

      return applicableRules.flatMap((rule) => rule.check(context))
    })

    return [...errors.map(parseErrorIssue), ...ruleIssues].sort(byPosition)
  }

  return { validate }
}
