export const getHtmlClassAttributeObject = (
  classes: string | string[] | Record<string, boolean | null | undefined> | null | undefined,
) => {
  if (!classes) {
    return {}
  }

  if (typeof classes === 'string') {
    return { [classes]: true }
  }

  if (Array.isArray(classes)) {
    return {
      [classes.join(' ')]: true,
    }
  }

  return classes
}
