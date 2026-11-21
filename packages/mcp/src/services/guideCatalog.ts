import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { GuideDefinition, GuideLookup, GuideSourceOptions, GuideSourceSection } from '../types'
import { bundledGuidesRoot, guideDefinitions, repoGuidesRoot } from '../configs'
import { GUIDE_TEXT_ENCODING, GUIDE_TOPIC_SEPARATOR, GUIDE_TOPIC_SEPARATOR_PATTERN, GUIDE_TOPICS } from '../constants'
import { extractMarkdownSection } from '../lib'
import { formatGuide } from '../utils'

/** `dist/guides` when the build shipped it beside the bundle, otherwise the monorepo sources. */
export const resolveGuideSourceRoot = ({
  bundledRoot = bundledGuidesRoot,
  repoRoot = repoGuidesRoot,
}: { bundledRoot?: string; repoRoot?: string } = {}): string => (existsSync(bundledRoot) ? bundledRoot : repoRoot)

/** Reads one mapped slice; a missing file or heading throws so a renamed doc never serves an empty guide. */
export const readGuideSection = (
  sourceRoot: string,
  { file, heading, includeSubsections }: GuideSourceSection,
): string => {
  const sourcePath = join(sourceRoot, file)

  if (!existsSync(sourcePath)) {
    throw new Error(`Guide source file is missing: ${sourcePath}`)
  }

  const markdown = readFileSync(sourcePath, GUIDE_TEXT_ENCODING).trim()

  if (heading === undefined) {
    return markdown
  }

  const section = extractMarkdownSection(markdown, heading, { includeSubsections })

  if (section === undefined) {
    throw new Error(`Guide source ${sourcePath} has no heading "${heading}"`)
  }

  return section
}

const normalizeTopic = (topic: string): string =>
  topic.trim().toLowerCase().replaceAll(GUIDE_TOPIC_SEPARATOR_PATTERN, GUIDE_TOPIC_SEPARATOR)

export const useGuideCatalogService = ({ sourceRoot = resolveGuideSourceRoot() }: GuideSourceOptions = {}) => ({
  listGuides: (): GuideDefinition[] => GUIDE_TOPICS.map((topic) => guideDefinitions[topic]),

  getGuide: (topic: string): GuideLookup => {
    const requestedTopic = normalizeTopic(topic)
    const definition = Object.values(guideDefinitions).find((candidate) => candidate.topic === requestedTopic)

    if (!definition) {
      return { found: false, topics: GUIDE_TOPICS }
    }

    const sectionMarkdown = definition.sections.map((section) => readGuideSection(sourceRoot, section))

    return { found: true, definition, markdown: formatGuide(definition, sectionMarkdown) }
  },
})
