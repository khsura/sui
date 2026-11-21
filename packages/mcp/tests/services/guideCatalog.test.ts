import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { repoGuidesRoot } from '../../src/configs'
import { GETTING_STARTED_SKILL_PATH, GUIDE_TOPICS, LIVE_EXAMPLES_LINE, LIVE_EXAMPLES_URL } from '../../src/constants'
import { readGuideSection, resolveGuideSourceRoot, useGuideCatalogService } from '../../src/services'
import { makeTempDir } from '../testProject'

const skillMarkdown = readFileSync(join(repoGuidesRoot, GETTING_STARTED_SKILL_PATH), 'utf8')
const catalog = useGuideCatalogService({ sourceRoot: repoGuidesRoot })

const guideText = (topic: string): string => {
  const lookup = catalog.getGuide(topic)

  if (!lookup.found) {
    throw new Error(`expected guide ${topic}`)
  }

  return lookup.markdown
}

describe('useGuideCatalogService', () => {
  it('lists every topic in order', () => {
    expect(catalog.listGuides().map(({ topic }) => topic)).toEqual([...GUIDE_TOPICS])
  })

  it.each(GUIDE_TOPICS)('%s ends with the live examples link', (topic) => {
    expect(guideText(topic).endsWith(LIVE_EXAMPLES_LINE)).toBe(true)
  })

  it('installation carries the current docs verbatim with the public npm install', () => {
    const text = guideText('installation')

    expect(text).toContain('## 1. Install (public npm)')
    expect(text).toContain('npm i @khsura/sui')
    expect(text).toContain('### Migrating from GitHub Packages')
    expect(text).toContain(LIVE_EXAMPLES_URL)
    expect(text).not.toContain('NPM_GITHUB_TOKEN')
    expect(text).not.toContain('read:packages')
    expect(text).toContain('## 4. Nuxt — `@khsura/sui-nuxt`')
    expect(text).toContain('@mdi/font/css/materialdesignicons.css')
    expect(text).not.toContain('## 5. App options')
    const installSection = readGuideSection(repoGuidesRoot, {
      file: GETTING_STARTED_SKILL_PATH,
      heading: '3. Styles and icons',
    })

    expect(skillMarkdown).toContain(installSection)
    expect(text).toContain(installSection)
  })

  it('theming covers theme colors and dark mode', () => {
    const text = guideText('theming')

    expect(text).toContain('### Theme colors')
    expect(text).toContain('setTheme(')
    expect(text).not.toContain('### Component defaults')
  })

  it('display covers useDisplay and the breakpoint table', () => {
    const text = guideText('display')

    expect(text).toContain('useDisplay()')
    expect(text).toContain('| `--md` | 1024px |')
  })

  it('accepts spacing, underscores and case in the topic', () => {
    expect(catalog.getGuide(' Common_Mistakes ').found).toBe(true)
    expect(catalog.getGuide('component defaults').found).toBe(true)
  })

  it('returns the topic list for an unknown topic', () => {
    expect(catalog.getGuide('routing')).toEqual({ found: false, topics: GUIDE_TOPICS })
  })

  it('throws when a mapped source file is missing', () => {
    const emptyRoot = makeTempDir()

    expect(() => useGuideCatalogService({ sourceRoot: emptyRoot }).getGuide('i18n')).toThrow(
      /Guide source file is missing/,
    )
  })

  it('throws when a mapped heading is gone from its source file', () => {
    const sourceRoot = makeTempDir()
    const sourcePath = join(sourceRoot, GETTING_STARTED_SKILL_PATH)

    mkdirSync(join(sourcePath, '..'), { recursive: true })
    writeFileSync(sourcePath, '# Renamed\n\nNothing here.\n')

    expect(() => useGuideCatalogService({ sourceRoot }).getGuide('i18n')).toThrow(/has no heading/)
  })

  it('prefers the bundled guides directory when it exists', () => {
    const bundledRoot = makeTempDir()

    expect(resolveGuideSourceRoot({ bundledRoot, repoRoot: '/repo' })).toBe(bundledRoot)
    expect(resolveGuideSourceRoot({ bundledRoot: join(bundledRoot, 'absent'), repoRoot: '/repo' })).toBe('/repo')
  })
})
