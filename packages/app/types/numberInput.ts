import { type numberInputControlVariants } from '@/app/constants'

/** Layout of SNumberInput's buttons: `stacked` (both at the end of the field) or `split` (minus first, plus last). */
export type NumberInputControlVariant = (typeof numberInputControlVariants)[number]

/** The range and rounding SNumberInput applies to a value. */
export type NumberInputBounds = {
  /** Lowest allowed value; `null` for no lower bound. */
  min: number | null
  /** Highest allowed value; `null` for no upper bound. */
  max: number | null
  /** Decimal places the value is rounded to; `null` keeps every decimal. */
  precision: number | null
}
