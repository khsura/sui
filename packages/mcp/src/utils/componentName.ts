import { COMPONENT_PREFIX, SUI_KEBAB_TAG_PATTERN, SUI_PASCAL_TAG_PATTERN } from '../constants'

const NAME_SEPARATORS = /[\s_-]/g

/** Lowercase key with separators removed: `SButton`, `s-button` and `sbutton` all map to `sbutton`. */
export const toComponentKey = (name: string): string => name.trim().toLowerCase().replaceAll(NAME_SEPARATORS, '')

/** Keys a query may refer to, most specific first: as typed, then with the `S` prefix added. */
export const candidateComponentKeys = (query: string): string[] => {
  const queryKey = toComponentKey(query)

  return [queryKey, `${COMPONENT_PREFIX}${queryKey}`]
}

/** `SNavigationDrawer` → `Navigation drawer`. */
export const humanizeComponentName = (name: string): string => {
  const words = name
    .replace(/^S(?=[A-Z])/, '')
    .split(/(?=[A-Z])/)
    .map((word) => word.toLowerCase())

  const sentence = words.join(' ')

  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

/** True for tags the validator treats as SUI components: `SButton` or `s-button`. Native tags such as `select` never match. */
export const isSuiComponentTag = (tag: string): boolean =>
  SUI_PASCAL_TAG_PATTERN.test(tag) || SUI_KEBAB_TAG_PATTERN.test(tag)
