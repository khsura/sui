import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { SuiApi } from '@khsura/shared/types'
import type { TemplateIssue } from '../../src/types'
import { SUI_M2_FIXES_VERSION } from '../../src/constants'
import { useTemplateValidatorService } from '../../src/services'
import { fixtureApi } from '../testTemplates'

/** The fixture API is 1.18.3, so the version-gated rules fire unless a test passes a newer one. */
const validateWith = (api: SuiApi, code: string): TemplateIssue[] => useTemplateValidatorService(api).validate(code)

const issuesWith = (api: SuiApi, rule: string, code: string): TemplateIssue[] =>
  validateWith(api, code).filter((issue) => issue.rule === rule)

const issuesOf = (rule: string, code: string): TemplateIssue[] => issuesWith(fixtureApi, rule, code)

type EvalRun = 'baseline' | 'with-mcp' | 'after-m2'

/** A page from the AI eval (`docs/ai-eval/<run>/pages`) that showed the misuse. */
const readEvalPage = (run: EvalRun, fileName: string): string =>
  readFileSync(fileURLToPath(new URL(`../../../../docs/ai-eval/${run}/pages/${fileName}`, import.meta.url)), 'utf8')

const evalIssues = (rule: string, run: EvalRun, fileName: string): [number, number][] =>
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

  describe('hidden-label-no-visible-name', () => {
    const rule = 'hidden-label-no-visible-name'

    it.each([
      ['the label stays visible', '<SInput label="Search by name" placeholder="e.g. Anna" />'],
      ['a placeholder that names the field', '<SInput label="Search" placeholder="Search files" hide-details />'],
      ['matching ignores case', '<SSelect label="Status" placeholder="Any status" hide-details />'],
      ['a bound placeholder', '<SInput label="Search" :placeholder="hint" hide-details />'],
      ['a bound label', '<SInput :label="title" hide-details />'],
      ['statically off', '<SInput label="Search" :hide-details="false" />'],
      [
        'slot content can name it',
        '<SInput label="Search" hide-details><template #suffix><SIcon icon="mdi-magnify" /></template></SInput>',
      ],
      ['a checkbox (its own rule)', '<SCheckbox label="Remember me" hide-details />'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      ['no placeholder', '<SInput label="Search" hide-details />'],
      ['a placeholder that shares no word', '<SInput label="Search by name" placeholder="e.g. Anna" hide-details />'],
      ['a select', '<SSelect label="Status" :items="items" hideDetails />'],
      ['a date picker input', '<SDatePickerInput label="From" hide-details />'],
    ])('reports %s', (_, code) => {
      const [issue] = issuesOf(rule, code)

      expect(issue).toMatchObject({ severity: 'warning', recipe: 'filter-bar' })
      expect(issue.fixHint).toContain('hide-details')
    })

    it('fires on the after-M2 eval search field whose label went missing', () => {
      expect(evalIssues(rule, 'after-m2', '03-mobile-list.vue').length).toBeGreaterThan(0)
    })
  })

  describe('snackbar-action-contrast', () => {
    const rule = 'snackbar-action-contrast'

    const snackbar = (button: string): string =>
      `<SSnackbar v-model="open"><template #action>${button}</template></SSnackbar>`

    it.each([
      ['a light preset colour', snackbar('<SButton variant="text" color="warning">Undo</SButton>')],
      ['a light CSS colour', snackbar('<SButton variant="text" color="#ffffff">Undo</SButton>')],
      ['a light short-hex CSS colour', snackbar('<SButton variant="text" color="#ff0">Undo</SButton>')],
      ['a named CSS colour (not measured)', snackbar('<SButton variant="text" color="navy">Undo</SButton>')],
      ['a dark CSS colour on a filled button', snackbar('<SButton color="#1976d2">Undo</SButton>')],
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

    it.each([
      ['a dark hex text action', '<SButton variant="text" color="#1976d2">Undo</SButton>', '#1976d2'],
      ['a dark short-hex icon action', '<SButton variant="icon" color="#333" aria-label="Close" />', '#333'],
    ])('reports %s (a CSS colour is used as is)', (_, button, color) => {
      const [issue] = issuesOf(rule, snackbar(button))

      expect(issue).toMatchObject({ severity: 'warning', recipe: 'activator-overlays' })
      expect(issue.message).toContain(`color="${color}"`)
      expect(issue.message).toMatch(/\d\.\d{2}:1/)
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

  describe('field-button-row', () => {
    const rule = 'field-button-row'

    it.each([
      [
        'an SFormRow',
        '<SFormRow><SInput v-model="q" label="Search" /><SButton color="primary">Search</SButton></SFormRow>',
      ],
      [
        'a field with hide-details',
        '<div class="s_display__flex"><SInput v-model="q" hide-details /><SButton>Search</SButton></div>',
      ],
      ['a block parent', '<div><SInput v-model="q" label="Search" /><SButton>Search</SButton></div>'],
      ['a flex row without a field', '<div style="display: flex"><SButton>A</SButton><SButton>B</SButton></div>'],
      [
        'a checkbox and a button',
        '<div style="display: flex"><SCheckbox v-model="c" label="A" /><SButton>B</SButton></div>',
      ],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      [
        'an inline flex style',
        '<div style="display: flex; gap: 8px">\n<SInput v-model="q" label="Search" />\n<SButton>Search</SButton></div>',
      ],
      [
        'a flex utility class',
        '<div class="s_display__flex">\n<SDatePickerInput v-model="from" />\n<SButton>Apply</SButton></div>',
      ],
      [
        'kebab-case tags',
        '<div style="display:flex">\n<s-select v-model="s" :items="items" />\n<s-button>Apply</s-button></div>',
      ],
    ])('reports a field and a button in %s', (_, code) => {
      const [issue] = issuesOf(rule, code)

      expect(issue).toMatchObject({ severity: 'warning', line: 3, recipe: 'filter-bar' })
      expect(issue.fixHint).toContain('SFormRow')
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

  describe('fill-height-under-app', () => {
    const rule = 'fill-height-under-app'

    it.each([
      ['a fill-height child of a plain div', '<SApp><div><div class="s_height--fill">x</div></div></SApp>'],
      ['a child of SApp without the class', '<SApp><div class="s_display__flex">x</div></SApp>'],
      ['the class outside SApp', '<div class="s_height--fill">x</div>'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it('reports a fill-height direct child of SApp', () => {
      const [issue] = issuesOf(
        rule,
        '<SApp>\n  <div class="s_display__flex s_align__center s_height--fill">x</div>\n</SApp>',
      )

      expect(issue).toMatchObject({ severity: 'warning', line: 2, column: 3, recipe: 'centered-page' })
      expect(issue.fixHint).toContain('min-height: 100dvh')
    })

    it('fires on the after-M2 eval login page whose card stuck to the top', () => {
      expect(evalIssues(rule, 'after-m2', '06-login.vue')).toEqual([[3, 5]])
    })
  })

  describe('version gates', () => {
    const olderApi: SuiApi = { ...fixtureApi, version: '1.19.4' }
    const fixedApi: SuiApi = { ...fixtureApi, version: SUI_M2_FIXES_VERSION }
    const newerApi: SuiApi = { ...fixtureApi, version: '1.21.0' }

    const snackbar = (button: string): string =>
      `<SSnackbar v-model="open"><template #action>${button}</template></SSnackbar>`

    const rulesWith = (api: SuiApi, code: string): string[] => validateWith(api, code).map((issue) => issue.rule)

    it.each([
      ['native-validation-in-form', '<SForm><SInput type="email" /></SForm>'],
      ['hide-details-hides-label', '<SCheckbox label="Remember me" hide-details />'],
      ['card-title-text-align', '<SCardTitle class="s_textAlign__center">Title</SCardTitle>'],
      ['date-picker-empty-string', '<SDatePickerInput model-value="" />'],
      ['fill-height-under-app', '<SApp><div class="s_height--fill">x</div></SApp>'],
      ['snackbar-action-contrast', snackbar('<SButton variant="text">Undo</SButton>')],
    ])('%s fires before the fix and stays silent from it on', (rule, code) => {
      expect(rulesWith(olderApi, code)).toContain(rule)
      expect(rulesWith(fixedApi, code)).not.toContain(rule)
      expect(rulesWith(newerApi, code)).not.toContain(rule)
    })

    it('keeps the gated rules when the version is not semver', () => {
      expect(rulesWith({ ...fixtureApi, version: 'dev' }, '<SForm><SInput type="email" /></SForm>')).toContain(
        'native-validation-in-form',
      )
    })

    describe('snackbar-action-contrast', () => {
      const rule = 'snackbar-action-contrast'

      it.each([
        ['a text action', '<SButton variant="text">Undo</SButton>'],
        ['an icon action', '<SButton variant="icon" icon="close" aria-label="Close" />'],
      ])('reports %s without a colour before the fix', (_, button) => {
        const [issue] = issuesWith(olderApi, rule, snackbar(button))

        expect(issue).toMatchObject({ severity: 'warning', recipe: 'activator-overlays' })
        expect(issue.message).toContain(`Before @khsura/sui ${SUI_M2_FIXES_VERSION}`)
        expect(issue.fixHint).toContain('color="warning"')
      })

      it.each([
        ['a filled button', '<SButton>Undo</SButton>'],
        ['a text-colour class', '<SButton variant="text" class="s_textColor__warning">Undo</SButton>'],
        ['a bound colour', '<SButton variant="text" :color="actionColor">Undo</SButton>'],
      ])('passes %s before the fix', (_, button) => {
        expect(issuesWith(olderApi, rule, snackbar(button))).toEqual([])
      })

      it.each(['primary', 'warning', 'error'])(
        'passes a %s text action from the fix on (the snackbar tunes preset text colours)',
        (color) => {
          expect(
            issuesWith(fixedApi, rule, snackbar(`<SButton variant="text" color="${color}">Undo</SButton>`)),
          ).toEqual([])
        },
      )

      it('keeps warning on a dark CSS colour from the fix on and suggests removing it', () => {
        const [issue] = issuesWith(fixedApi, rule, snackbar('<SButton variant="text" color="#1976d2">Undo</SButton>'))

        expect(issue).toMatchObject({ severity: 'warning', recipe: 'activator-overlays' })
        expect(issue.fixHint).toContain('Remove `color`')
      })

      it('does not suggest removing the colour before the fix', () => {
        const [issue] = issuesWith(olderApi, rule, snackbar('<SButton variant="text" color="primary">Undo</SButton>'))

        expect(issue.fixHint).not.toContain('Remove `color`')
        expect(issue.fixHint).toContain('color="warning"')
      })
    })
  })
})

describe('avatar-text-not-initials', () => {
  it.each([
    ['a full name', '<SAvatar text="Jane Doe" />', 'text="JD" alt="Jane Doe"'],
    ['a long word', '<s-avatar text="Administrator" />', 'text="A" alt="Administrator"'],
    ['a bound literal', `<SAvatar :text="'Bat Erdene Munkh Ochir'" />`, 'text="BEM"'],
  ])('flags %s', (_, code, fix) => {
    const issues = issuesOf('avatar-text-not-initials', code)

    expect(issues).toHaveLength(1)
    expect(issues[0].fixHint).toContain(fix)
  })

  it.each([
    ['initials', '<SAvatar text="JD" />'],
    ['three letters', '<SAvatar text="ABC" />'],
    ['a bound expression', '<SAvatar :text="user.initials" />'],
    ['another component', '<SChip text="Jane Doe" />'],
  ])('accepts %s', (_, code) => {
    expect(issuesOf('avatar-text-not-initials', code)).toEqual([])
  })
})

describe('SPagination rules', () => {
  describe('pagination-length-rows', () => {
    const rule = 'pagination-length-rows'

    it.each([
      ['a page count', '<SPagination v-model="page" :length="pageCount" />'],
      ['a division', '<SPagination v-model="page" :length="Math.ceil(items.length / perPage)" />'],
      ['a literal', '<SPagination v-model="page" :length="10" />'],
      ['a static attribute', '<SPagination v-model="page" length="10" />'],
      ['totalPages', '<SPagination v-model="page" :length="totalPages" />'],
      ['another component', '<STable :length="items.length" />'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      ['an array length', '<SPagination v-model="page" :length="items.length" />'],
      ['a nested array length', '<SPagination v-model="page" :length="response.data.rows.length" />'],
      ['totalItems', '<SPagination v-model="page" :length="totalItems" />'],
      ['itemsCount', '<s-pagination v-model="page" :length="itemsCount" />'],
    ])('reports %s', (_, code) => {
      const [issue] = issuesOf(rule, code)

      expect(issue).toMatchObject({ severity: 'warning', line: 1 })
      expect(issue.fixHint).toContain('Math.ceil')
    })
  })

  describe('pagination-zero-based', () => {
    const rule = 'pagination-zero-based'

    it.each([
      ['a page ref', '<SPagination v-model="page" :length="10" />'],
      ['a nested page', '<SPagination v-model="state.currentPage" :length="10" />'],
      ['no model', '<SPagination :length="10" />'],
    ])('passes: %s', (_, code) => {
      expect(issuesOf(rule, code)).toEqual([])
    })

    it.each([
      ['pageIndex', '<SPagination v-model="pageIndex" :length="10" />'],
      ['a nested index', '<SPagination v-model="table.pageIndex" :length="10" />'],
      ['a model-value index', '<SPagination :model-value="pageIndex" :length="10" />'],
    ])('reports %s', (_, code) => {
      const [issue] = issuesOf(rule, code)

      expect(issue).toMatchObject({ severity: 'warning' })
      expect(issue.fixHint).toContain('page.value - 1')
    })
  })

  it('accepts a correct SPagination and rejects a misspelt prop', () => {
    const valid = validateWith(fixtureApi, '<SPagination v-model="page" :length="pageCount" show-first-last-page />')
    const misspelt = validateWith(fixtureApi, '<SPagination v-model="page" :length="pageCount" :total-visibl="5" />')

    expect(valid).toEqual([])
    expect(misspelt.map((issue) => issue.rule)).toContain('unknown-prop')
  })

  describe('SEmptyState API', () => {
    it('accepts a correct SEmptyState and catches a misspelt or Vuetify prop', () => {
      expect(
        validateWith(
          fixtureApi,
          '<SEmptyState icon="mdi-inbox-outline" title="No orders" text="Create one." action-text="Create" size="small" @action="create" />',
        ),
      ).toEqual([])
      expect(validateWith(fixtureApi, '<SEmptyState headline="No orders" />').map((issue) => issue.rule)).toContain(
        'unknown-prop',
      )
    })
  })

  describe('empty-state-action-event', () => {
    it.each([
      ['click:action', '<SEmptyState action-text="Retry" @click:action="retry" />'],
      ['click', '<SEmptyState action-text="Retry" @click="retry" />'],
      ['click (v-on)', '<SEmptyState action-text="Retry" v-on:click.stop="retry" />'],
    ])('flags @%s', (_, code) => {
      const issues = issuesOf('empty-state-action-event', code)

      expect(issues).toHaveLength(1)
      expect(issues[0].fixHint).toContain('@action="retry"')
    })

    it('accepts @action', () => {
      expect(issuesOf('empty-state-action-event', '<SEmptyState action-text="Retry" @action="retry" />')).toEqual([])
    })
  })

  describe('empty-state-action-without-listener', () => {
    it.each([
      ['a static action-text', '<SEmptyState title="No orders" action-text="Create order" />'],
      ['a bound actionText', '<SEmptyState title="No orders" :actionText="label" />'],
    ])('flags %s with no @action', (_, code) => {
      expect(issuesOf('empty-state-action-without-listener', code)).toHaveLength(1)
    })

    it.each([
      ['an @action listener', '<SEmptyState action-text="Create order" @action="create" />'],
      [
        'the actions slot',
        '<SEmptyState action-text="Create order"><template #actions><SButton to="/new">New</SButton></template></SEmptyState>',
      ],
      ['a v-bind spread', '<SEmptyState action-text="Create order" v-bind="emptyProps" />'],
      ['no action-text', '<SEmptyState title="No orders" />'],
    ])('accepts %s', (_, code) => {
      expect(issuesOf('empty-state-action-without-listener', code)).toEqual([])
    })
  })
})
