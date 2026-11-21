import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { guideDefinitions, guideSourceFiles, repoGuidesRoot } from '../../src/configs'
import { GUIDE_TOPICS } from '../../src/constants'
import { readGuideSection } from '../../src/services'

describe('guide topic mapping', () => {
  it('defines every topic under its own key', () => {
    expect(Object.keys(guideDefinitions).sort()).toEqual([...GUIDE_TOPICS].sort())
    GUIDE_TOPICS.forEach((topic) => expect(guideDefinitions[topic].topic).toBe(topic))
  })

  it.each(guideSourceFiles)('mapped source file %s exists in the repo', (sourceFile) => {
    expect(existsSync(join(repoGuidesRoot, sourceFile))).toBe(true)
  })

  it.each(GUIDE_TOPICS)('every section of %s resolves to non-empty markdown', (topic) => {
    guideDefinitions[topic].sections.forEach((section) => {
      expect(readGuideSection(repoGuidesRoot, section).trim().length).toBeGreaterThan(0)
    })
  })
})
