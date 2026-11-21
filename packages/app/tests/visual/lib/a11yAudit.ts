import { AxeBuilder } from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { a11yAxeTags, a11yBlockingImpacts } from '../constants'
import type { A11yViolation } from '../types'

// Runs axe on the whole story iframe (overlays teleport to <body>) and keeps the serious and critical findings.
export const findBlockingA11yViolations = async (page: Page): Promise<A11yViolation[]> => {
  const axeResults = await new AxeBuilder({ page }).withTags(a11yAxeTags).analyze()

  return axeResults.violations.filter((violation) => a11yBlockingImpacts.includes(violation.impact ?? ''))
}

// One line per failing node, so a CI log names the rule, the element and how to fix it without opening a report.
export const formatA11yViolations = (violations: A11yViolation[]) =>
  violations
    .flatMap((violation) =>
      violation.nodes.map(
        (node) =>
          `[${violation.impact}] ${violation.id}: ${violation.help} — ${node.target.join(' ')}\n  ${node.failureSummary ?? ''}`,
      ),
    )
    .join('\n')
