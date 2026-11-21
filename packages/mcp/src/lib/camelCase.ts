const KEBAB_SEGMENT = /-(\w)/g

/** `extension-height` → `extensionHeight`; names without dashes are returned unchanged. */
export const toCamelCase = (name: string): string =>
  name.replace(KEBAB_SEGMENT, (_, letter: string) => letter.toUpperCase())
