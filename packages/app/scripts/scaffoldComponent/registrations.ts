import {
  COMPONENT_EXPORT_PATTERN,
  COMPONENT_TABLE_ROW_PATTERN,
  LINE_BREAK,
  PROPS_EXPORT_PATTERN,
  SKILL_INDEX_HEADING,
  SUMMARY_FIRST_TABLE_HEADING,
  TABLE_ROW_START,
} from './constants'
import type { ComponentNames } from './types'

type LineKey = (line: string, index: number) => string | undefined

/**
 * Inserts `newLine` among the lines that `keyOf` recognises, before the first one whose key sorts after `newKey`
 * (or after the last of them). Other lines stay where they are. Returns the source unchanged when the line is
 * already there.
 */
export const insertSortedLine = (source: string, newLine: string, newKey: string, keyOf: LineKey): string => {
  const lines = source.split(LINE_BREAK)

  if (lines.includes(newLine)) {
    return source
  }

  const keyedIndexes = lines.flatMap((line, index) => (keyOf(line, index) === undefined ? [] : [index]))

  if (!keyedIndexes.length) {
    throw new Error(`no line to insert "${newLine}" next to`)
  }

  const nextIndex = keyedIndexes.find((index) => (keyOf(lines[index], index) ?? '') > newKey)
  const insertAt = nextIndex ?? keyedIndexes[keyedIndexes.length - 1] + 1

  lines.splice(insertAt, 0, newLine)

  return lines.join(LINE_BREAK)
}

const matchKey =
  (pattern: RegExp): LineKey =>
  (line) =>
    pattern.exec(line)?.[1]

/** Rows of the first markdown table after `heading`, so rows of later tables are never keyed. */
const tableRowKey = (source: string, heading: string): LineKey => {
  const lines = source.split(LINE_BREAK)
  const headingIndex = lines.indexOf(heading)
  const tableStart = lines.findIndex((line, index) => index > headingIndex && line.startsWith(TABLE_ROW_START))
  const tableLength = lines.slice(tableStart).findIndex((line) => !line.startsWith(TABLE_ROW_START))
  const tableEnd = tableLength === -1 ? lines.length : tableStart + tableLength

  return (line, index) =>
    headingIndex !== -1 && index >= tableStart && index < tableEnd
      ? COMPONENT_TABLE_ROW_PATTERN.exec(line)?.[1]
      : undefined
}

/** definitions/props/index.ts */
export const registerPropsExport = (source: string, names: ComponentNames): string =>
  insertSortedLine(source, `export * from './${names.propsFile}'`, names.propsFile, matchKey(PROPS_EXPORT_PATTERN))

/** components/index.ts: the flat `export { default as SX }` block. */
export const registerComponentExport = (source: string, names: ComponentNames): string =>
  insertSortedLine(
    source,
    `export { default as ${names.component} } from './${names.vueFile}'`,
    names.component,
    matchKey(COMPONENT_EXPORT_PATTERN),
  )

/** The reference index table in plugins/sui-plugin/skills/sui-component/SKILL.md. */
export const registerSkillIndexRow = (source: string, names: ComponentNames): string =>
  insertSortedLine(
    source,
    `| \`${names.component}\` | [references/${names.kebab}.md](references/${names.kebab}.md) |`,
    names.component,
    tableRowKey(source, SKILL_INDEX_HEADING),
  )

/** The first table ("Basic UI") of docs/summary.md; move the row to the right section by hand. */
export const registerSummaryRow = (source: string, names: ComponentNames): string =>
  insertSortedLine(
    source,
    `| \`${names.component}\` | \`import { ${names.component} } from '@khsura/sui'\` | [${names.kebab}.md](./components/${names.kebab}.md) |`,
    names.component,
    tableRowKey(source, SUMMARY_FIRST_TABLE_HEADING),
  )
