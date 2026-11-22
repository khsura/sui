import type { TemplateIssue } from '../../src/types'
import { useTemplateValidatorService } from '../../src/services'
import { fixtureApi, readTemplateFixture, withComponents } from '../testTemplates'

const validate = (code: string): TemplateIssue[] => useTemplateValidatorService(fixtureApi).validate(code)
const rulesOf = (code: string): string[] => validate(code).map((issue) => issue.rule)

describe('useTemplateValidatorService', () => {
  describe('valid templates', () => {
    it.each([
      ['SButton with an enum value', '<SButton size="small">Save</SButton>'],
      ['kebab-case tag with a bound boolean', '<s-button :block="true">Save</s-button>'],
      ['kebab-case attribute for a camelCase prop', '<SAppBar extension-height="48" />'],
      ['v-bind:prop long form', '<SButton v-bind:size="buttonSize" />'],
      ['v-model on SInput', '<SInput v-model="email" label="Email" />'],
      ['named v-model on a model prop', '<SDialog v-model:modelValue="open" />'],
      ['dynamic enum binding is not enum-checked', '<SButton :size="x" />'],
      ['events are not props', '<SButton @click="save" v-on:mouseenter="hover">Go</SButton>'],
      ['v-bind object spread', '<SButton v-bind="attrs" />'],
      [
        'global and fall-through attributes',
        '<SButton class="a" style="b" id="c" key="d" ref="e" role="button" aria-label="Save" data-test="save" type="submit" />',
      ],
      [
        'known named slot',
        '<SDialog><template #activator="{ on, attrs }"><SButton v-bind="attrs" v-on="on" /></template></SDialog>',
      ],
      [
        'v-slot long form and default slot',
        '<SDialog><template v-slot:activator="{ on, attrs }"><a v-on="on" v-bind="attrs">a</a></template><template #default>b</template></SDialog>',
      ],
      ['dynamic slot name is skipped', '<SDialog><template #[slotName]>x</template></SDialog>'],
      ['native tags starting with s are ignored', '<section><span /><slot /><strong /></section>'],
      ['non-SUI components are ignored', '<RouterLink to="/" fancy="yes" />'],
      ['enum value from a quoted literal binding', `<SButton :size="'large'" />`],
      ['structural directives are ignored', '<SButton v-if="ok" v-for="item in items" v-show="visible" />'],
    ])('%s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it('a full SFC using several components has no issues', () => {
      expect(validate(readTemplateFixture('validPage.vue.txt'))).toEqual([])
    })
  })

  describe('invalid templates', () => {
    it('reports an enum value outside the literals', () => {
      const [issue] = validate('<SButton size="big">Save</SButton>')

      expect(issue).toMatchObject({ rule: 'invalid-enum-value', severity: 'error', line: 1, column: 10 })
      expect(issue.message).toContain('`big`')
      expect(issue.fixHint).toContain('`small`')
    })

    it('enum-checks a quoted literal binding', () => {
      expect(rulesOf(`<SButton :size="'huge'" />`)).toEqual(['invalid-enum-value'])
    })

    it('reports a misspelt component with the closest suggestion', () => {
      const [issue] = validate('<SButon>Save</SButon>')

      expect(issue).toMatchObject({ rule: 'unknown-component', line: 1, column: 1 })
      expect(issue.fixHint).toContain('Did you mean `SButton`')
    })

    describe('names from other UI libraries (the AI eval misses)', () => {
      const aliasApi = withComponents(fixtureApi, ['SColumn', 'SWindow', 'SWindowItem'])

      const unknownIssue = (code: string): TemplateIssue | undefined =>
        useTemplateValidatorService(aliasApi)
          .validate(code)
          .find((issue) => issue.rule === 'unknown-component')

      it.each([
        ['<SCol cols="6" />', 'SUI equivalent: `SColumn`'],
        ['<STextField label="Email" />', 'SUI equivalent: `SInput`'],
        ['<STabsWindow v-model="tab" />', 'SUI equivalent: `SWindow`'],
        ['<s-tabs-window-item value="a" />', 'SUI equivalent: `SWindowItem`'],
      ])('maps %s first', (code, advice) => {
        const issue = unknownIssue(code)

        expect(issue?.message).toContain('a name from another UI library')
        expect(issue?.fixHint.startsWith(advice)).toBe(true)
      })

      it('lists the Levenshtein names after the mapping', () => {
        const fixHint = unknownIssue('<STextField />')?.fixHint ?? ''

        expect(fixHint).toContain('Other close names')
        expect(fixHint.indexOf('SInput')).toBeLessThan(fixHint.indexOf('Other close names'))
      })

      it('accepts the real component once it exists', () => {
        const api = withComponents(aliasApi, ['SModal'])

        expect(useTemplateValidatorService(api).validate('<SModal />')).toEqual([])
      })
    })

    it('reports a misspelt kebab-case component', () => {
      expect(rulesOf('<s-buton />')).toEqual(['unknown-component'])
    })

    it('does not run prop rules on an unknown component', () => {
      expect(rulesOf('<SButon size="big" colour="red" />')).toEqual(['unknown-component'])
    })

    it('reports an unknown prop with a suggestion', () => {
      const [issue] = validate('<SButton colour="red" />')

      expect(issue).toMatchObject({ rule: 'unknown-prop', column: 10 })
      expect(issue.message).toBe('`SButton` has no prop `colour`.')
      expect(issue.fixHint).toContain('`color`')
    })

    it('reports an unknown bound prop', () => {
      expect(rulesOf('<SButton :loading="busy" />')).toEqual(['unknown-prop'])
    })

    it('reports v-model on a component without modelValue', () => {
      const [issue] = validate('<SButton v-model="value" />')

      expect(issue.rule).toBe('unknown-prop')
      expect(issue.message).toContain('`modelValue`')
    })

    it('reports a named v-model on a prop the component lacks', () => {
      expect(rulesOf('<SInput v-model:open="value" />')).toEqual(['unknown-prop'])
    })

    it('reports an unknown slot on SDialog with the valid names', () => {
      const [issue] = validate('<SDialog>\n  <template #trigger>x</template>\n</SDialog>')

      expect(issue).toMatchObject({ rule: 'unknown-slot', line: 2, column: 13 })
      expect(issue.fixHint).toBe('Use one of: `activator`, `default`.')
    })

    it('reports v-slot on the component itself when the slot does not exist', () => {
      expect(rulesOf('<SSelect v-slot:options>x</SSelect>')).toEqual(['unknown-slot'])
    })

    it('reports template syntax errors', () => {
      expect(rulesOf('<div><SButton></div>')).toContain('parse-error')
    })

    it('finds components nested inside native elements and slots', () => {
      expect(
        rulesOf(
          '<div><SDialog><template #activator="{ on, attrs }"><p v-on="on" v-bind="attrs"><SButton size="tiny" /></p></template></SDialog></div>',
        ),
      ).toEqual(['invalid-enum-value'])
    })
  })

  describe('positions', () => {
    it('reports 1-based line and column positions in the whole SFC, sorted', () => {
      const issues = validate(readTemplateFixture('brokenPage.vue.txt'))

      expect(issues.map((issue) => [issue.line, issue.column, issue.rule])).toEqual([
        [7, 5, 'unknown-component'],
        [8, 14, 'invalid-enum-value'],
        [8, 25, 'unknown-prop'],
        [10, 17, 'unknown-slot'],
      ])
    })

    it('reports positions in a multi-line fragment', () => {
      const [issue] = validate('<div>\n\n    <SButton\n      size="big"\n    />\n</div>')

      expect([issue.line, issue.column]).toEqual([4, 7])
    })
  })

  it('accepts a custom rule list so new rules plug in without touching the engine', () => {
    const issues = useTemplateValidatorService(fixtureApi, [
      {
        id: 'always',
        check: ({ element }) => [
          { line: 1, column: 1, rule: 'always', severity: 'warning', message: element.tag, fixHint: 'none' },
        ],
      },
    ]).validate('<SButton /><s-input />')

    expect(issues.map((issue) => issue.message)).toEqual(['SButton', 's-input'])
  })

  it('reports any named slot on a component that has no slots', () => {
    const [issue] = validate('<SIcon><template #prepend>x</template></SIcon>')

    expect(issue).toMatchObject({ rule: 'unknown-slot', message: '`SIcon` has no slot `prepend`.' })
    expect(issue?.fixHint).toContain('has no slots')
  })

  describe('dynamic slot patterns', () => {
    it.each([
      [
        'item.<column>',
        '<STable :headers="headers" :items="items"><template #item.name="{ value }">{{ value }}</template></STable>',
      ],
      ['header.<column>', '<STable :headers="headers" :items="items"><template #header.name>Name</template></STable>'],
      [
        'named slot next to patterns',
        '<STable :headers="headers" :items="items"><template #noData>-</template></STable>',
      ],
    ])('accepts %s', (_, code) => {
      expect(validate(code)).toEqual([])
    })

    it('reports a misspelled pattern slot and lists the readable names', () => {
      const [issue] = validate('<STable :headers="headers" :items="items"><template #itme.name>x</template></STable>')

      expect(issue).toMatchObject({ rule: 'unknown-slot', message: '`STable` has no slot `itme.name`.' })
      expect(issue?.fixHint).toContain('`item.<column>`')
    })

    it('requires something after the pattern prefix', () => {
      expect(rulesOf('<STable :headers="headers" :items="items"><template #item.>x</template></STable>')).toEqual([
        'unknown-slot',
      ])
    })
  })

  it('an SFC without a template block has nothing to validate', () => {
    expect(validate('<script setup lang="ts">\nconst a = 1\n</script>')).toEqual([])
  })
})
