import {
  PRIMITIVE_TYPE_ORDER,
  TRAILING_TYPE_ORDER,
  TYPE_CLOSING_BRACKETS,
  TYPE_OPENING_BRACKETS,
  TYPE_QUOTE_CHARACTERS,
  UNION_SEPARATOR,
  UNION_SORT_LOCALE,
} from './constants'

// A fixed locale with numeric collation: `2` sorts before `10`, the same on every machine.
const NATURAL_ORDER = new Intl.Collator(UNION_SORT_LOCALE, { numeric: true })

/** Splits a printed type on its top-level `|`, leaving unions nested in brackets or quotes intact. */
const splitTopLevelUnion = (type: string): string[] => {
  const members: string[] = []
  let depth = 0
  let quote: string | null = null
  let start = 0

  for (let index = 0; index < type.length; index++) {
    const character = type[index]

    if (quote) {
      quote = character === quote && type[index - 1] !== '\\' ? null : quote
    } else if (TYPE_QUOTE_CHARACTERS.includes(character)) {
      quote = character
    } else if (TYPE_OPENING_BRACKETS.includes(character)) {
      depth++
    } else if (TYPE_CLOSING_BRACKETS.includes(character) && !(character === '>' && type[index - 1] === '=')) {
      depth--
    } else if (depth === 0 && type.startsWith(UNION_SEPARATOR, index)) {
      members.push(type.slice(start, index))
      start = index + UNION_SEPARATOR.length
      index += UNION_SEPARATOR.length - 1
    }
  }

  return [...members, type.slice(start)]
}

/** Primitives first (in a fixed order), then everything else alphabetically, then `null` and `undefined`. */
const memberRank = (member: string): [number, string] => {
  const primitive = PRIMITIVE_TYPE_ORDER.indexOf(member)
  const trailing = TRAILING_TYPE_ORDER.indexOf(member)

  if (primitive >= 0) {
    return [primitive, '']
  }

  if (trailing >= 0) {
    return [PRIMITIVE_TYPE_ORDER.length + 1 + trailing, '']
  }

  return [PRIMITIVE_TYPE_ORDER.length, member]
}

/**
 * The TypeScript checker prints union members in type-creation order, which changes between runs
 * (`boolean | "left" | "right"` vs `"left" | "right" | boolean`). Sorting the top-level members makes
 * the generated API metadata and skill tables stable, so `check:skills` doesn't fail at random.
 */
export const normalizeUnionType = (type: string): string => {
  const members = splitTopLevelUnion(type)

  if (members.length < 2) {
    return type
  }

  return [...members]
    .sort((left, right) => {
      const [leftRank, leftKey] = memberRank(left)
      const [rightRank, rightKey] = memberRank(right)

      if (leftRank !== rightRank) {
        return leftRank - rightRank
      }

      return NATURAL_ORDER.compare(leftKey, rightKey)
    })
    .join(UNION_SEPARATOR)
}
