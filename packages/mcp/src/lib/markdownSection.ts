import { MARKDOWN_FENCE_PATTERN, MARKDOWN_HEADING_PATTERN, MARKDOWN_TRAILING_FILLER_PATTERN } from '../constants'

interface MarkdownHeading {
  lineIndex: number
  level: number
  text: string
}

/** Headings outside fenced code blocks (a `# comment` inside a bash fence is not a heading). */
const findHeadings = (lines: readonly string[]): MarkdownHeading[] => {
  const headings: MarkdownHeading[] = []
  let insideFence = false

  lines.forEach((line, lineIndex) => {
    if (MARKDOWN_FENCE_PATTERN.test(line)) {
      insideFence = !insideFence

      return
    }

    const match = insideFence ? null : MARKDOWN_HEADING_PATTERN.exec(line)

    if (match?.[1] && match[2]) {
      headings.push({ lineIndex, level: match[1].length, text: match[2] })
    }
  })

  return headings
}

/**
 * Returns the section that starts at the heading whose text equals `heading`, up to the next heading of
 * the same or a higher level (or, with `includeSubsections: false`, the next heading of any level).
 * Trailing blank lines and `---` rules are trimmed. `undefined` when no such heading exists.
 */
export const extractMarkdownSection = (
  markdown: string,
  heading: string,
  { includeSubsections = true }: { includeSubsections?: boolean } = {},
): string | undefined => {
  const lines = markdown.split('\n')
  const headings = findHeadings(lines)
  const startIndex = headings.findIndex(({ text }) => text === heading)
  const start = headings[startIndex]

  if (!start) {
    return undefined
  }

  const end = headings.slice(startIndex + 1).find(({ level }) => !includeSubsections || level <= start.level)
  const sectionLines = lines.slice(start.lineIndex, end?.lineIndex ?? lines.length)

  while (sectionLines.length && MARKDOWN_TRAILING_FILLER_PATTERN.test(sectionLines.at(-1) ?? '')) {
    sectionLines.pop()
  }

  return sectionLines.join('\n')
}
