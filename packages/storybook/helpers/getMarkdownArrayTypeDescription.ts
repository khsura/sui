export const getMarkdownArrayTypeDescription = (
  list: Array<string | number | null>,
  options?: { separator: string },
) => {
  const separator = options?.separator ?? ','

  return list.map((v) => JSON.stringify(v)).join(separator)
}
