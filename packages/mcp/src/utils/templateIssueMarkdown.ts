import type { ResolvedSuiApi, TemplateIssue } from '../types'
import { SEVERITY_ERROR, SEVERITY_WARNING } from '../constants'
import { formatSourceHeader } from './componentMarkdown'

const countLabel = (count: number, noun: string): string => `${count} ${noun}${count === 1 ? '' : 's'}`

/** "N errors, M warnings", or "No issues found" for a clean template. */
export const summarizeTemplateIssues = (issues: TemplateIssue[]): string => {
  if (!issues.length) {
    return 'No issues found.'
  }

  const errorCount = issues.filter((issue) => issue.severity === SEVERITY_ERROR).length
  const warningCount = issues.filter((issue) => issue.severity === SEVERITY_WARNING).length

  return `${countLabel(errorCount, 'error')}, ${countLabel(warningCount, 'warning')}.`
}

/** `6:14 [invalid-enum-value] … — fix: …`, plus ` — recipe: <name>` when a recipe shows the pattern. */
export const formatTemplateIssue = (issue: TemplateIssue): string =>
  `${issue.line}:${issue.column} [${issue.rule}] ${issue.message} — fix: ${issue.fixHint}${issue.recipe ? ` — recipe: \`${issue.recipe}\`` : ''}`

export const formatTemplateValidation = (resolved: ResolvedSuiApi, issues: TemplateIssue[]): string =>
  [
    formatSourceHeader(resolved),
    '',
    summarizeTemplateIssues(issues),
    ...(issues.length ? ['', ...issues.map((issue) => `- ${formatTemplateIssue(issue)}`)] : []),
  ].join('\n')
