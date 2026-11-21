import type { GuideDefinition, GuideTopic } from '../types'
import { GET_GUIDE_TOOL_NAME, GUIDE_SECTION_SEPARATOR, LIVE_EXAMPLES_LINE } from '../constants'
import { inlineCode, markdownTable } from '../lib'

export const formatGuide = (definition: GuideDefinition, sectionMarkdown: readonly string[]): string =>
  [`# ${definition.title}`, ...sectionMarkdown, LIVE_EXAMPLES_LINE].join(GUIDE_SECTION_SEPARATOR)

export const formatGuideList = (definitions: readonly GuideDefinition[]): string =>
  [
    `${definitions.length} guides. Read one with ${inlineCode(GET_GUIDE_TOOL_NAME)} and its topic.`,
    markdownTable(
      ['Topic', 'Guide', 'Covers'],
      definitions.map(({ topic, title, summary }) => [inlineCode(topic), title, summary]),
    ),
    LIVE_EXAMPLES_LINE,
  ].join(GUIDE_SECTION_SEPARATOR)

export const formatUnknownGuide = (query: string, topics: readonly GuideTopic[]): string =>
  `Unknown guide topic ${inlineCode(query)}. Available topics: ${topics.map(inlineCode).join(', ')}.`
