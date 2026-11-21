const escapeCell = (cell: string): string => cell.replaceAll('|', '\\|').replaceAll(/\s*\n\s*/g, ' ')

/** Inline code span that survives a markdown table cell. */
export const inlineCode = (text: string): string => (text.includes('`') ? `\`\` ${text} \`\`` : `\`${text}\``)

export const markdownTable = (headers: string[], rows: string[][]): string => {
  const toRow = (cells: string[]) => `| ${cells.map(escapeCell).join(' | ')} |`

  return [toRow(headers), toRow(headers.map(() => '---')), ...rows.map(toRow)].join('\n')
}
