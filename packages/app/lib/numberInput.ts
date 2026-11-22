import { numberInputMaxPrecision } from '@/app/constants'
import { type NumberInputBounds } from '@/app/types'

const decimalSeparator = '.'
const exponentSeparator = 'e-'

/** Decimal places a number is written with: `0.25` → 2, `3` → 0, `1e-7` → 7. */
export const getDecimalCount = (value: number) => {
  const text = value.toString()
  const exponentIndex = text.indexOf(exponentSeparator)

  if (exponentIndex !== -1) {
    return Number(text.slice(exponentIndex + exponentSeparator.length))
  }

  const separatorIndex = text.indexOf(decimalSeparator)

  return separatorIndex === -1 ? 0 : text.length - separatorIndex - 1
}

/** Rounds to `precision` decimal places, dropping binary noise such as `0.1 + 0.2`; `null` keeps the value. */
export const getRoundedNumber = (value: number, precision: number | null) => {
  if (precision === null) {
    return value
  }

  return Number(value.toFixed(Math.min(Math.max(precision, 0), numberInputMaxPrecision)))
}

/** Keeps a value inside `min` and `max` (either may be `null` for no bound). */
export const getClampedNumber = (value: number, { min, max }: Pick<NumberInputBounds, 'min' | 'max'>) => {
  const lowPassValue = min === null ? value : Math.max(value, min)

  return max === null ? lowPassValue : Math.min(lowPassValue, max)
}

/** Rounds a value to the bounds' precision, then clamps it into their range. */
export const getNormalizedNumber = (value: number, bounds: NumberInputBounds) => {
  return getClampedNumber(getRoundedNumber(value, bounds.precision), bounds)
}

/** Reads the number typed into a field; empty or unfinished text (`-`, `.`) and anything else is `null`. */
export const getParsedNumberText = (text: string) => {
  const trimmedText = text.trim()

  if (!/\d/.test(trimmedText)) {
    return null
  }

  const value = Number(trimmedText)

  return Number.isFinite(value) ? value : null
}

/**
 * Whether text may stay in the field while the user types: digits, one leading `-` when negatives are allowed,
 * and a `.` followed by at most `precision` digits (none when `precision` is 0, any when it is `null`).
 */
export const getIsNumberTextAllowed = (
  text: string,
  { allowNegative, precision }: { allowNegative: boolean; precision: number | null },
) => {
  const sign = allowNegative ? '-?' : ''
  const decimals = precision === null ? '(\\.\\d*)?' : precision > 0 ? `(\\.\\d{0,${precision}})?` : ''

  return new RegExp(`^${sign}\\d*${decimals}$`).test(text)
}

/** The text a field shows for a value: `precision` fixed decimals, or the plain number when it is `null`. */
export const getNumberText = (value: number | null | undefined, precision: number | null) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return ''
  }

  return precision === null
    ? value.toString()
    : value.toFixed(Math.min(Math.max(precision, 0), numberInputMaxPrecision))
}

/** A numeric prop given as a number or a string (`min="0"`); `null` when it is missing or not a finite number. */
export const getOptionalNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value.toString().trim() === '') {
    return null
  }

  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : null
}
