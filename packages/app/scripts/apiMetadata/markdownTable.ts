import { MARKDOWN_TABLE_NEWLINE_PATTERN, MARKDOWN_TABLE_PIPE_PATTERN, MARKDOWN_TABLE_SEPARATOR } from './constants'

const escapeCell = (cell: string): string =>
  cell.replace(MARKDOWN_TABLE_PIPE_PATTERN, '\\|').replace(MARKDOWN_TABLE_NEWLINE_PATTERN, ' ')

/** Inline code span that survives a markdown table cell. */
export const inlineCode = (text: string): string => (text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``)

export const markdownTable = (headers: string[], rows: string[][]): string => {
  const toRow = (cells: string[]) => `| ${cells.map(escapeCell).join(' | ')} |`

  return [toRow(headers), toRow(headers.map(() => MARKDOWN_TABLE_SEPARATOR)), ...rows.map(toRow)].join('\n')
}
