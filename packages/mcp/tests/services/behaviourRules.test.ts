import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { TemplateIssue } from '../../src/types'
import { useTemplateValidatorService } from '../../src/services'
import { fixtureApi } from '../testTemplates'

const validate = (code: string): TemplateIssue[] => useTemplateValidatorService(fixtureApi).validate(code)
const issuesOf = (rule: string, code: string): TemplateIssue[] => validate(code).filter((issue) => issue.rule === rule)

/** A page from the AI eval (`docs/ai-eval/<run>/pages`) that showed the misuse. */
const readEvalPage = (run: 'baseline' | 'with-mcp', fileName: string): string =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/ai-eval/${run}/pages/${fileName}`, import.meta.url)), 'utf8')

const evalIssues = (rule: string, run: 'baseline' | 'with-mcp', fileName: string): [number, number][] =>
  issuesOf(rule, readEvalPage(run, fileName)).map((issue) => [issue.line, issue.column])

describe('behaviour rules', () => {
  describe('native-validation-in-form', () => {
    const rule = 'native-validation-in-form'

    it.each([
      ['text input with inputmode', '<SForm><SInput type="text" inputmode="email" autocomplete="email" /></SForm>'],
      ['email input outside a form', '<SInput type="email" />'],
      ['SForm with novalidate', '<SForm novalidate><SInput type="email" /><SInput type="number" /></SForm>'],
      ['a password input', '<SForm><SInput type="password" /></SForm>'],
      ['a bound type', '<SForm><SInput :type="fieldType" /></SForm>'],
      ['a submit button', '<SForm><SButton type="submit">Save</SButton></SForm>'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each(['email', 'url', 'number'])('reports type="%s" inside SForm', (inputType) => {
      const [issue] = issuesOf(rule, `<SForm>\n  <SInput type="${inputType}" />\n</SForm>`)

      expect(issue).toMatchObject({ severity: 'warning', line: 2, column: 11, recipe: 'validated-form' })
    })

    it('suggests inputmode for email and novalidate for number', () => {
      const [emailIssue] = issuesOf(rule, '<SForm><SInput :type="\'email\'" /></SForm>')
      const [numberIssue] = issuesOf(rule, '<s-form><s-input type="number" /></s-form>')

      expect(emailIssue.fixHint).toContain('inputmode="email"')
      expect(numberIssue.fixHint).toContain('novalidate')
    })

    it('fires on the eval pages that copied type="email" from the recipe', () => {
      expect(evalIssues(rule, 'with-mcp', '01-settings.vue')).toEqual([[12, 15]])
      expect(evalIssues(rule, 'with-mcp', '06-login.vue')).toEqual([[12, 15]])
    })
  })

  describe('hide-details-hides-label', () => {
    const rule = 'hide-details-hides-label'

    it.each([
      ['hide-error instead', '<SCheckbox label="Remember me" hide-error />'],
      ['no label', '<SCheckbox v-model="checked" hide-details />'],
      ['statically off', '<SCheckbox label="Remember me" :hide-details="false" />'],
      ['a text input (it has a placeholder to fall back on)', '<SInput label="Search" hide-details />'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      ['kebab case', '<SCheckbox label="Remember me" hide-details />'],
      ['camel case', '<s-checkbox label="Remember me" hideDetails />'],
      ['bound', '<SCheckbox :label="text" :hide-details="true" />'],
    ])('reports %s', (_, code) => {
      const [issue] = issuesOf(rule, code)

      expect(issue).toMatchObject({ severity: 'warning', recipe: 'validated-form' })
      expect(issue.fixHint).toContain('hide-error')
    })

    it('fires on the eval login page whose "Remember me" label went missing', () => {
      expect(evalIssues(rule, 'with-mcp', '06-login.vue')).toEqual([[39, 72]])
    })
  })

  describe('snackbar-action-contrast', () => {
    const rule = 'snackbar-action-contrast'

    const snackbar = (button: string): string =>
      `<SSnackbar v-model="open"><template #action>${button}</template></SSnackbar>`

    it.each([
      ['a light preset colour', snackbar('<SButton variant="text" color="warning">Undo</SButton>')],
      ['a CSS colour', snackbar('<SButton variant="text" color="#ffffff">Undo</SButton>')],
      ['a filled primary button', snackbar('<SButton color="primary">Undo</SButton>')],
      ['a primary text button outside the snackbar', '<SButton variant="text" color="primary">Undo</SButton>'],
      ['a bound colour', snackbar('<SButton variant="text" :color="actionColor">Undo</SButton>')],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it('reports a primary text button nested in the action slot', () => {
      const [issue] = issuesOf(
        rule,
        snackbar('<div><SButton variant="text" color="primary" @click="undo">Undo</SButton></div>'),
      )

      expect(issue).toMatchObject({ severity: 'warning', line: 1, column: 50, recipe: 'activator-overlays' })
      expect(issue.fixHint).toContain('color="warning"')
    })

    it('fires on the eval snackbar page (primary Undo at 2.18:1, success Close)', () => {
      expect(evalIssues(rule, 'with-mcp', '09-snackbar.vue')).toEqual([
        [51, 9],
        [58, 9],
      ])
    })
  })

  describe('block-buttons-in-row', () => {
    const rule = 'block-buttons-in-row'

    it.each([
      ['one block button', '<div class="s_display__flex"><SButton block>A</SButton><SButton>B</SButton></div>'],
      ['block buttons in a block parent', '<div><SButton block>A</SButton><SButton block>B</SButton></div>'],
      [
        'block buttons in their own columns',
        '<SRow><SColumn :cols="6"><SButton block>A</SButton></SColumn><SColumn :cols="6"><SButton block>B</SButton></SColumn></SRow>',
      ],
      [
        'block turned off',
        '<SCardActions><SButton block>A</SButton><SButton :block="false">B</SButton></SCardActions>',
      ],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      [
        'a flex utility class',
        '<div class="s_display__flex">\n<SButton block>A</SButton>\n<SButton block>B</SButton></div>',
      ],
      [
        'a responsive flex class',
        '<div :class="\'s_display--md__flex\'">\n<SButton block>A</SButton>\n<SButton block>B</SButton></div>',
      ],
      [
        'an inline flex style',
        '<div style="display: flex">\n<SButton block>A</SButton>\n<SButton block>B</SButton></div>',
      ],
      ['SCardActions', '<SCardActions>\n<SButton block>A</SButton>\n<SButton block>B</SButton></SCardActions>'],
    ])('reports block buttons in %s', (_, code) => {
      expect(issuesOf(rule, code)).toMatchObject([{ severity: 'warning', line: 3, recipe: 'responsive-grid' }])
    })

    it('fires on the baseline eval page whose Reset button was pushed off screen', () => {
      expect(evalIssues(rule, 'baseline', '04-date-range-filter.vue')).toEqual([[41, 19]])
    })
  })

  describe('card-title-text-align', () => {
    const rule = 'card-title-text-align'

    it.each([
      ['flex justify class', '<SCardTitle class="s_justify__center">Title</SCardTitle>'],
      ['text-align on a subtitle', '<SCardSubtitle class="s_textAlign__center">Sub</SCardSubtitle>'],
      ['text-align on a plain element', '<h2 class="s_textAlign__center">Title</h2>'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      ['s_textAlign__center', 's_justify__center'],
      ['s_textAlign--md__right', 's_justify__end'],
      ['s_textAlign__justify', 's_justify__*'],
    ])('reports %s and suggests %s', (className, suggestion) => {
      const [issue] = issuesOf(rule, `<SCardTitle class="s_text--h5 ${className}">Title</SCardTitle>`)

      expect(issue).toMatchObject({ severity: 'warning', line: 1, column: 13 })
      expect(issue.fixHint).toContain(suggestion)
    })

    it('fires on the baseline eval login page whose title stayed left-aligned', () => {
      expect(evalIssues(rule, 'baseline', '06-login.vue')).toEqual([[5, 21]])
    })
  })

  describe('date-picker-empty-string', () => {
    const rule = 'date-picker-empty-string'

    const page = (script: string, template: string): string =>
      `<script setup lang="ts">\n${script}\n</script>\n<template>\n  ${template}\n</template>`

    it.each([
      ['a null ref', page('const date = ref<string | null>(null)', '<SDatePickerInput v-model="date" />')],
      ['a filled date', page("const date = ref('2026-01-01')", '<SDatePickerInput v-model="date" />')],
      [
        'a null object field',
        page("const form = ref({ from: null, to: '' })", '<SDatePickerInput v-model="form.from" />'),
      ],
      ['a fragment without a script', '<SDatePickerInput v-model="date" />'],
      ['an expression model', page("const date = ref('')", '<SInput v-model="date" />')],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      ['a ref', page("const startDate = ref('')", '<SDatePickerInput v-model="startDate" />')],
      ['a typed ref', page('const startDate = ref<string>("")', '<SDatePickerInput v-model="startDate" />')],
      [
        'an object field',
        page("const form = reactive({ startDate: '' })", '<SDatePickerInput v-model="form.startDate" />'),
      ],
      ['a literal model-value', page('', '<SDatePickerInput :model-value="\'\'" />')],
    ])('reports %s', (_, code) => {
      const [issue] = issuesOf(rule, code)

      expect(issue).toMatchObject({ severity: 'warning', recipe: 'validated-form' })
      expect(issue.fixHint).toContain('null')
    })

    it('fires on the eval date-range page that opened on "Invalid date"', () => {
      expect(evalIssues(rule, 'with-mcp', '04-date-range-filter.vue')).toEqual([
        [8, 31],
        [12, 15],
      ])
    })
  })
})
