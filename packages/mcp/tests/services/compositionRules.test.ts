import type { TemplateIssue } from '../../src/types'
import { useTemplateValidatorService } from '../../src/services'
import { fixtureApi, readTemplateFixture } from '../testTemplates'

const validate = (code: string): TemplateIssue[] => useTemplateValidatorService(fixtureApi).validate(code)
const issuesOf = (rule: string, code: string): TemplateIssue[] => validate(code).filter((issue) => issue.rule === rule)

describe('composition rules', () => {
  describe('activator-binding', () => {
    it.each([
      [
        'destructured on and attrs',
        '<SDialog><template #activator="{ on, attrs }"><SButton v-on="on" v-bind="attrs">Open</SButton></template></SDialog>',
      ],
      [
        'slot props object',
        '<SMenu><template #activator="props"><SButton v-on="props.on" v-bind="props.attrs">Menu</SButton></template></SMenu>',
      ],
      [
        'renamed destructuring',
        '<SSnackbar><template v-slot:activator="{ on: open, attrs: activatorAttrs }"><SButton v-bind="activatorAttrs" v-on="open" /></template></SSnackbar>',
      ],
      [
        'rest element',
        '<s-dialog><template #activator="{ ...slotProps }"><SButton v-on="slotProps.on" v-bind="slotProps.attrs" /></template></s-dialog>',
      ],
      [
        'STooltip without slot props',
        '<STooltip location="top"><template #activator><SButton>Hover</SButton></template>Tip</STooltip>',
      ],
      ['overlay without an activator slot', '<SDialog v-model="open">Body</SDialog>'],
    ])('passes: %s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it('reports an activator slot that ignores its slot props', () => {
      const [issue] = issuesOf(
        'activator-binding',
        '<SDialog><template #activator><SButton>Open</SButton></template></SDialog>',
      )

      expect(issue).toMatchObject({ severity: 'error', line: 1, column: 20, recipe: 'activator-overlays' })
      expect(issue.fixHint).toContain('#activator="{ on, attrs }"')
    })

    it('reports a missing v-bind="attrs"', () => {
      const [issue] = issuesOf(
        'activator-binding',
        '<SMenu><template #activator="{ on, attrs }"><SButton v-on="on">Open</SButton></template></SMenu>',
      )

      expect(issue).toMatchObject({ severity: 'error', line: 1, column: 45 })
      expect(issue.message).toContain('`v-bind="attrs"`')
      expect(issue.message).not.toContain('v-on')
    })

    it('reports a missing v-on through a slot props object', () => {
      const [issue] = issuesOf(
        'activator-binding',
        '<SDialog><template #activator="props"><SButton v-bind="props.attrs" /></template></SDialog>',
      )

      expect(issue.message).toContain('`v-on="props.on"`')
    })

    it('reports both when neither is bound', () => {
      const [issue] = issuesOf(
        'activator-binding',
        '<SSnackbar><template #activator="{ on, attrs }"><SButton /></template></SSnackbar>',
      )

      expect(issue.message).toContain('`v-on="on"` and `v-bind="attrs"`')
    })

    it('reports a destructuring that does not expose attrs', () => {
      const [issue] = issuesOf(
        'activator-binding',
        '<SDialog><template #activator="{ on }"><SButton v-on="on" /></template></SDialog>',
      )

      expect(issue.fixHint).toContain('does not expose both')
    })

    it('warns when STooltip activator slot props are bound, since STooltip passes none', () => {
      const [issue] = issuesOf(
        'activator-binding',
        '<STooltip><template #activator="{ on, attrs }"><SButton v-on="on" v-bind="attrs" /></template></STooltip>',
      )

      expect(issue).toMatchObject({ severity: 'warning', recipe: 'activator-overlays' })
    })
  })

  describe('layout-for', () => {
    it.each([
      [
        'named layout with matching for',
        '<SLayout name="admin"><SAppBar for="admin" /><SMain for="admin" /></SLayout>',
      ],
      ['app-level layout without for', '<SLayout><SAppBar /><SNavigationDrawer /><SMain /></SLayout>'],
      ['app prop joins the app-level layout on purpose', '<SLayout name="admin"><SMain app /></SLayout>'],
      [
        'for matches an outer layout',
        '<SLayout name="outer"><SLayout name="inner"><SMain for="outer" /></SLayout></SLayout>',
      ],
      ['no SLayout in this file: the layout lives in a parent', '<SAppBar /><SMain for="admin" />'],
      ['dynamic for is not compared', '<SLayout name="admin"><SMain :for="layoutName" /></SLayout>'],
      ['dynamic layout name is not compared', '<SLayout :name="layoutName"><SMain for="admin" /></SLayout>'],
      ['quoted literal for binding', `<SLayout name="admin"><SMain :for="'admin'" /></SLayout>`],
    ])('passes: %s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it('reports a child without for inside a named layout', () => {
      const [issue] = issuesOf('layout-for', '<SLayout name="admin">\n  <SAppBar />\n</SLayout>')

      expect(issue).toMatchObject({ severity: 'error', line: 2, column: 3, recipe: 'app-shell' })
      expect(issue.fixHint).toBe('Add `for="admin"`.')
    })

    it('reports a for that matches no enclosing layout', () => {
      const [issue] = issuesOf('layout-for', '<SLayout name="admin"><s-main for="admn" /></SLayout>')

      expect(issue).toMatchObject({ severity: 'error', column: 31 })
      expect(issue.fixHint).toBe('Use `for="admin"`.')
    })

    it('reports a for inside an app-level layout that names no layout here', () => {
      const [issue] = issuesOf('layout-for', '<SLayout><SFooter for="admin" /></SLayout>')

      expect(issue.fixHint).toContain('Remove `for`')
    })
  })

  describe('form-rules-outside-form', () => {
    it.each([
      ['input inside SForm', '<SForm><SInput :rules="[required]" /></SForm>'],
      ['nested deeper inside SForm', '<SForm><div><STextarea :rules="rules" /></div></SForm>'],
      ['input without rules', '<SInput v-model="name" />'],
    ])('passes: %s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it('warns about rules on an input with no enclosing SForm', () => {
      const [issue] = issuesOf('form-rules-outside-form', '<div><SInput :rules="[required]" /></div>')

      expect(issue).toMatchObject({ severity: 'warning', column: 14, recipe: 'validated-form' })
      expect(issue.fixHint).toContain('SForm')
    })
  })

  describe('icon-button-label', () => {
    it.each([
      ['aria-label', '<SButton aria-label="Close"><SIcon icon="mdi-close" /></SButton>'],
      ['bound aria-label', '<SButton :aria-label="t(\'close\')"><SIcon icon="mdi-close" /></SButton>'],
      ['title', '<SButton title="Close"><SIcon icon="mdi-close" /></SButton>'],
      ['icon with text', '<SButton><SIcon icon="mdi-plus" /> Add</SButton>'],
      ['v-bind object may carry a label', '<SButton v-bind="buttonAttrs"><SIcon icon="mdi-close" /></SButton>'],
      ['text only', '<SButton>Save</SButton>'],
    ])('passes: %s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it('warns about an icon-only button without a label', () => {
      const [issue] = issuesOf('icon-button-label', '<SButton>\n  <SIcon icon="mdi-close" />\n</SButton>')

      expect(issue).toMatchObject({ severity: 'warning', line: 1, column: 1 })
      expect(issue.fixHint).toContain('aria-label')
    })
  })

  describe('no-raw-replacement', () => {
    it.each([
      ['hidden input', '<input type="hidden" name="token" value="x" />'],
      ['SUI equivalents', '<SForm><SButton>Go</SButton><SInput /><STextarea /></SForm>'],
      ['other native tags', '<form><label>a</label><span /></form>'],
    ])('passes: %s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it.each([
      ['<button>Go</button>', 'SButton'],
      ['<input v-model="name" />', 'SInput'],
      ['<input type="checkbox" />', 'SCheckbox'],
      ['<select><option>a</option></select>', 'SSelect'],
      ['<textarea />', 'STextarea'],
      ['<dialog open>Hi</dialog>', 'SDialog'],
    ])('warns about %s', (code, replacement) => {
      const [issue] = issuesOf('no-raw-replacement', code)

      expect(issue).toMatchObject({ severity: 'warning', line: 1, column: 1 })
      expect(issue.fixHint).toBe(`Use \`${replacement}\` instead.`)
    })
  })

  describe('SFC fixtures', () => {
    it('a page composed correctly has no issues', () => {
      expect(validate(readTemplateFixture('composedPage.vue.txt'))).toEqual([])
    })

    it('a page composed incorrectly reports each composition rule with a recipe', () => {
      const issues = validate(readTemplateFixture('miscomposedPage.vue.txt'))

      expect(issues.map((issue) => [issue.line, issue.rule, issue.recipe])).toEqual([
        [7, 'layout-for', 'app-shell'],
        [8, 'icon-button-label', 'app-shell'],
        [12, 'activator-binding', 'activator-overlays'],
        [14, 'form-rules-outside-form', 'validated-form'],
        [15, 'no-raw-replacement', 'validated-form'],
      ])
    })
  })
})
