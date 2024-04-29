export const getNumericCssAttribute = (attribute?: string | number | null | undefined, unit = 'px') => {
  if (attribute === '' || attribute === null || attribute === undefined) {
    return ''
  }

  return Number.isNaN(Number(attribute)) ? attribute.toString() : `${attribute}${unit}`
}
