import {
  COMPONENT_PREFIX,
  CSS_BLOCK_PREFIX,
  PROPS_TYPE_PREFIX,
  VUE_EXTENSION,
  WORD_BOUNDARY_PATTERN,
} from './constants'
import { componentNameSchema } from './schemas'
import type { ComponentNames } from './types'

const lowerFirst = (value: string) => `${value.charAt(0).toLowerCase()}${value.slice(1)}`

// `SAvatar` and `Avatar` both mean SAvatar; `Select` stays `Select` (an `S` followed by a lowercase letter is a word).
const stripPrefix = (name: string) =>
  name.length > 1 && name.startsWith(COMPONENT_PREFIX) && name.charAt(1) === name.charAt(1).toUpperCase()
    ? name.slice(1)
    : name

/** Every spelling of a component name that the scaffold needs; throws on a name that is not PascalCase. */
export const toComponentNames = (input: string): ComponentNames => {
  const base = stripPrefix(componentNameSchema.parse(input))
  const camel = lowerFirst(base)
  const componentFile = `${lowerFirst(COMPONENT_PREFIX)}${base}`

  return {
    base,
    component: `${COMPONENT_PREFIX}${base}`,
    camel,
    kebab: base.replace(WORD_BOUNDARY_PATTERN, '$1-$2').toLowerCase(),
    propsType: `${PROPS_TYPE_PREFIX}${base}`,
    propsFile: `${lowerFirst(PROPS_TYPE_PREFIX)}${base}`,
    componentFile,
    vueFile: `${componentFile}${VUE_EXTENSION}`,
    cssBlock: `${CSS_BLOCK_PREFIX}${camel}`,
  }
}
