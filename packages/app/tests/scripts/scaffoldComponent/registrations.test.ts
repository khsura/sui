import fs from 'node:fs'
import path from 'node:path'
import { toComponentNames } from '../../../scripts/scaffoldComponent/componentNames'
import {
  registerComponentExport,
  registerPropsExport,
  registerSkillIndexRow,
  registerSummaryRow,
} from '../../../scripts/scaffoldComponent/registrations'

const appRoot = path.resolve(import.meta.dirname, '../../..')
const read = (file: string) => fs.readFileSync(path.join(appRoot, file), 'utf8')
const names = toComponentNames('Rating')

const lineAfter = (source: string, line: string) => {
  const lines = source.split('\n')

  return lines[lines.indexOf(line) + 1]
}

describe('scaffold registrations on the real files', () => {
  it('adds the props export in order', () => {
    const updated = registerPropsExport(read('definitions/props/index.ts'), names)

    expect(lineAfter(updated, "export * from './propsRadioGroup'")).toBe("export * from './propsRating'")
  })

  it('adds the component export to the flat block', () => {
    const updated = registerComponentExport(read('components/index.ts'), names)

    expect(updated).toContain("export { default as SRating } from './sRating.vue'")
    expect(lineAfter(updated, "export { default as SRating } from './sRating.vue'")).toMatch(
      /^export \{ default as S\w+ \}/,
    )
  })

  it('adds the skill index row inside the reference table', () => {
    const updated = registerSkillIndexRow(read('../../plugins/sui-plugin/skills/sui-component/SKILL.md'), names)
    const row = '| `SRating` | [references/rating.md](references/rating.md) |'

    expect(
      lineAfter(
        updated,
        '| `SProgressLinear`, `SProgressCircular` | [references/progress.md](references/progress.md) |',
      ),
    ).toBe(row)
  })

  it('adds the summary row to the first table only', () => {
    const source = read('docs/summary.md')
    const updated = registerSummaryRow(source, names)
    const firstTable = updated.split('\n---\n')[1]

    expect(firstTable).toContain('`SRating`')
    expect(updated.split('\n').length).toBe(source.split('\n').length + 1)
  })

  it('is idempotent', () => {
    const once = registerPropsExport(read('definitions/props/index.ts'), names)

    expect(registerPropsExport(once, names)).toBe(once)
  })
})
