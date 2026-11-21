import {
  CLOSING_BRACKETS,
  DEFAULT_SEPARATOR,
  ENTRY_SEPARATOR,
  IDENTIFIER_PATTERN,
  OBJECT_PATTERN_CLOSE,
  OBJECT_PATTERN_OPEN,
  OPENING_BRACKETS,
  RENAME_SEPARATOR,
  REST_ELEMENT_PREFIX,
} from '../constants'

/** Splits on commas that are not nested inside brackets: `a, b = [1, 2]` → `a`, `b = [1, 2]`. */
const splitTopLevel = (source: string): string[] => {
  const entries: string[] = []
  let depth = 0
  let current = ''

  for (const character of source) {
    if (OPENING_BRACKETS.includes(character)) {
      depth += 1
    } else if (CLOSING_BRACKETS.includes(character)) {
      depth -= 1
    }

    if (character === ENTRY_SEPARATOR && depth === 0) {
      entries.push(current)
      current = ''
    } else {
      current += character
    }
  }

  return [...entries, current].map((entry) => entry.trim()).filter(Boolean)
}

const destructuredAccessor = (inner: string, key: string): string | undefined => {
  let restName: string | undefined

  for (const entry of splitTopLevel(inner)) {
    if (entry.startsWith(REST_ELEMENT_PREFIX)) {
      restName = entry.slice(REST_ELEMENT_PREFIX.length).trim()
      continue
    }

    const [binding] = entry.split(DEFAULT_SEPARATOR)
    const [entryKey, localName] = binding.split(RENAME_SEPARATOR).map((part) => part.trim())

    if (entryKey === key) {
      return localName || entryKey
    }
  }

  return restName ? `${restName}.${key}` : undefined
}

/**
 * The expression that reaches slot prop `key` given a slot props pattern:
 * `{ on, attrs }` → `on`, `{ on: open }` → `open`, `{ ...rest }` → `rest.on`, `props` → `props.on`.
 * `undefined` when the pattern does not expose `key`.
 */
export const slotPropAccessor = (pattern: string, key: string): string | undefined => {
  const trimmed = pattern.trim()

  if (trimmed.startsWith(OBJECT_PATTERN_OPEN) && trimmed.endsWith(OBJECT_PATTERN_CLOSE)) {
    return destructuredAccessor(trimmed.slice(OBJECT_PATTERN_OPEN.length, -OBJECT_PATTERN_CLOSE.length), key)
  }

  return IDENTIFIER_PATTERN.test(trimmed) ? `${trimmed}.${key}` : undefined
}
