import type { FrontMatterDocument } from '../types'
import { FRONT_MATTER_LINE_PATTERN, FRONT_MATTER_LINE_SEPARATOR, FRONT_MATTER_PATTERN } from '../constants'

const parseFrontMatterLine = (line: string): [string, string][] => {
  const [, key, value] = FRONT_MATTER_LINE_PATTERN.exec(line) ?? []

  return key === undefined || value === undefined ? [] : [[key, value]]
}

/** Splits a markdown file into its `---` front matter and body; `undefined` when it has no front matter. */
export const parseFrontMatter = (markdown: string): FrontMatterDocument | undefined => {
  const [, block, body] = FRONT_MATTER_PATTERN.exec(markdown) ?? []

  if (block === undefined || body === undefined) {
    return undefined
  }

  return {
    attributes: Object.fromEntries(block.split(FRONT_MATTER_LINE_SEPARATOR).flatMap(parseFrontMatterLine)),
    body: body.trim(),
  }
}
