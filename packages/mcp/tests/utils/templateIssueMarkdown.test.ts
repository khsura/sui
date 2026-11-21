import type { TemplateIssue } from '../../src/types'
import { formatTemplateIssue } from '../../src/utils'

const issue: TemplateIssue = { line: 3, column: 5, rule: 'layout-for', severity: 'error', message: 'm', fixHint: 'f' }

describe('formatTemplateIssue', () => {
  it('formats an issue without a recipe', () => {
    expect(formatTemplateIssue(issue)).toBe('3:5 [layout-for] m — fix: f')
  })

  it('appends the recipe name when there is one', () => {
    expect(formatTemplateIssue({ ...issue, recipe: 'app-shell' })).toBe(
      '3:5 [layout-for] m — fix: f — recipe: `app-shell`',
    )
  })
})
