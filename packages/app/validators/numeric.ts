export const validatorNumericCssAttribute = (value: string | number | null | undefined) => {
  if (typeof value === 'number') {
    return true
  }

  const numericCssRegex = /^-?[0-9]+(px|em|rem|vh|vw|vmin|vmax|%)?$/

  return value === undefined || value === null || value === '' || numericCssRegex.test(value.toString())
}
