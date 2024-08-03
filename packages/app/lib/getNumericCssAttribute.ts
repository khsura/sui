export const getNumericCssAttribute = (attribute?: string | number | null | undefined, unit = 'px') => {
  if (attribute === '' || attribute === null || attribute === undefined) {
    return undefined
  }

  return Number.isNaN(Number(attribute)) ? attribute.toString() : `${attribute}${unit}`
}
