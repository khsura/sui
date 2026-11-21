import type { SuiApi } from '@khsura/shared/types'
import { renderSkillTableBlock, syncSkillTableMarkdown } from '../../../scripts/apiMetadata/skillTables'

const api: SuiApi = {
  package: '@khsura/sui',
  version: '1.0.0',
  generatedAt: '2026-01-01T00:00:00.000Z',
  components: [
    {
      name: 'SButton',
      family: 'core',
      file: 'components/sButton.vue',
      props: [
        { name: 'loading', type: 'boolean | undefined', required: false, default: 'false', description: '' },
        {
          name: 'variant',
          type: '"fab" | "text" | undefined',
          required: false,
          description: 'Visual style.',
          enumValues: ['fab', 'text'],
        },
      ],
      slots: [{ name: 'default', type: '{}', description: '' }],
      events: [{ name: 'click', type: '[value: Event]', description: '' }],
    },
    {
      name: 'STable',
      family: 'table',
      file: 'components/table/sTable.vue',
      props: [],
      slots: [{ name: 'item.<column>', type: '{ value: unknown }', description: '', pattern: '^item\\..+$' }],
      events: [],
    },
  ],
}

const block = (name: string, body: string) =>
  `<!-- generated:api:start ${name} -->\n${body}\n<!-- generated:api:end ${name} -->`

describe('syncSkillTableMarkdown', () => {
  it('replaces only the content between the markers', () => {
    const markdown = `# SButton\n\nIntro prose.\n\n${block('SButton', '| old | table |')}\n\n## Gotchas\n\n- keep me\n`
    const sync = syncSkillTableMarkdown(markdown, api)

    expect(sync.content).toBe(
      `# SButton\n\nIntro prose.\n\n${renderSkillTableBlock(api.components[0])}\n\n## Gotchas\n\n- keep me\n`,
    )
    expect(sync.content).not.toContain('| old | table |')
    expect(sync.components).toEqual(['SButton'])
    expect(sync.unknownComponents).toEqual([])
    expect(sync.malformedMarkers).toEqual([])
  })

  it('renders props, slots (with pattern) and events tables', () => {
    const sync = syncSkillTableMarkdown(`${block('SButton', '')}\n${block('STable', '')}`, api)

    expect(sync.content).toContain('| Prop | Type | Default | Required | Values | Description |')
    expect(sync.content).toContain('| `loading` | `boolean` | `false` | no | — | — |')
    expect(sync.content).toContain('| `variant` | `"fab" \\| "text"` | — | no | `fab`, `text` | Visual style. |')
    expect(sync.content).toContain('| `default` | `{}` |')
    expect(sync.content).toContain('| `click` | `[value: Event]` |')
    expect(sync.content).toContain('`item.<column>` (pattern `^item\\..+$`)')
    expect(sync.content).toContain('**STable props**\n\nNone.')
    expect(sync.components).toEqual(['SButton', 'STable'])
  })

  it('is idempotent', () => {
    const first = syncSkillTableMarkdown(`Intro\n\n${block('SButton', '')}\n\nOutro\n`, api).content
    const second = syncSkillTableMarkdown(first, api).content

    expect(second).toBe(first)
  })

  it('reports an unknown component and leaves its block untouched', () => {
    const unknownBlock = block('SNope', 'hand-written')
    const sync = syncSkillTableMarkdown(`${unknownBlock}\n\n${block('SButton', '')}`, api)

    expect(sync.unknownComponents).toEqual(['SNope'])
    expect(sync.content.startsWith(unknownBlock)).toBe(true)
    expect(sync.components).toEqual(['SButton'])
  })

  it('reports unmatched markers without rewriting them', () => {
    const markdown = '<!-- generated:api:start SButton -->\ntext\n<!-- generated:api:end STable -->\n'
    const sync = syncSkillTableMarkdown(markdown, api)

    expect(sync.content).toBe(markdown)
    expect(sync.malformedMarkers).toEqual(['start SButton without matching end', 'end STable without start'])
  })

  it('leaves files without markers untouched', () => {
    const markdown = '# SDivider\n\n| Prop | Type |\n|---|---|\n| `vertical` | `boolean` |\n'
    const sync = syncSkillTableMarkdown(markdown, api)

    expect(sync.content).toBe(markdown)
    expect(sync.components).toEqual([])
  })
})
