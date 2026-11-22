import { toComponentNames } from '../../../scripts/scaffoldComponent/componentNames'
import { planScaffoldFiles, planScaffoldRegistrations } from '../../../scripts/scaffoldComponent/scaffoldPlan'

const names = toComponentNames('SkeletonLoader')

describe('planScaffoldFiles', () => {
  const files = planScaffoldFiles(names)
  const contentOf = (filePath: string) => files.find((file) => file.path === filePath)?.content ?? ''

  it('plans every file the checklist asks for', () => {
    expect(files.map((file) => file.path)).toEqual([
      'definitions/props/propsSkeletonLoader.ts',
      'components/sSkeletonLoader.vue',
      'storybook/stories/skeletonLoader.stories.ts',
      'tests/components/sSkeletonLoader.test.ts',
      'docs/components/skeleton-loader.md',
      '../../plugins/sui-plugin/skills/sui-component/references/skeleton-loader.md',
    ])
  })

  it('wires the component to its props type, defaults and slots', () => {
    const vue = contentOf('components/sSkeletonLoader.vue')

    expect(vue).toContain('defineProps<PropsSkeletonLoader>()')
    expect(vue).toContain("useComponentDefaultsService('SSkeletonLoader', rawProps)")
    expect(vue).toContain('defineSlots<')
    expect(vue).toContain('.s_skeletonLoader {')
  })

  it('tags one stress story visual and gives it a play function', () => {
    const story = contentOf('storybook/stories/skeletonLoader.stories.ts')

    expect(story).toContain("tags: ['visual']")
    expect(story).toContain('play: async')
  })

  it('leaves an empty generated:api marker pair for sync:skills to fill', () => {
    const reference = contentOf('../../plugins/sui-plugin/skills/sui-component/references/skeleton-loader.md')

    expect(reference).toContain(
      '<!-- generated:api:start SSkeletonLoader -->\n<!-- generated:api:end SSkeletonLoader -->',
    )
  })

  it('links the docs to the Storybook site', () => {
    expect(contentOf('docs/components/skeleton-loader.md')).toContain(
      'https://sui.surakh.com/?path=/docs/ui-components-skeletonloader--docs',
    )
  })
})

describe('planScaffoldRegistrations', () => {
  it('registers in the barrels, the skill index and the docs summary', () => {
    expect(planScaffoldRegistrations(names).map((registration) => registration.path)).toEqual([
      'definitions/props/index.ts',
      'components/index.ts',
      '../../plugins/sui-plugin/skills/sui-component/SKILL.md',
      'docs/summary.md',
    ])
  })
})
