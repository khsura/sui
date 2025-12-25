export const extractInterfaceString = (text: string, name: string) => {
  const matchExp = new RegExp(`(interface|enum|type) ${name}.+?}`, 'gs')
  const matches = text.match(matchExp)

  return matches?.[0] ?? ''
}
