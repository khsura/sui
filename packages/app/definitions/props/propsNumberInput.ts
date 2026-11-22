import { type PropsFormInput } from './propsFormInput'
import { type PropsSizePreset } from './propsSizePreset'
import { type NumberInputControlVariant } from '@/app/types'

export type PropsNumberInput = {
  /** Text above the field. With `hideDetails` it is hidden and becomes the field's `aria-label`. */
  label?: string | undefined | null
  /** Hint shown while the field is empty. */
  placeholder?: string | undefined | null
  /** Lowest allowed value. A lower value is clamped up to it on blur, and the decrement button stops there. */
  min?: number | string | undefined | null
  /** Highest allowed value. A higher value is clamped down to it on blur, and the increment button stops there. */
  max?: number | string | undefined | null
  /** Amount the buttons and the ArrowUp / ArrowDown keys add or remove. Default `1`. */
  step?: number | string | undefined | null
  /**
   * Decimal places the value keeps. Default `0` (whole numbers; typing `.` is refused). Use `2` for money.
   * `null` allows any number of decimals. The field shows exactly this many decimals once it loses focus.
   */
  precision?: number | null | undefined
  /** Layout of the buttons: `stacked` (both at the end of the field, default) or `split` (minus first, plus last). */
  controlVariant?: NumberInputControlVariant | undefined | null
  /** Hides the increment and decrement buttons; the arrow keys still step the value. */
  hideControls?: boolean | undefined | null
  /** Text inside the field before the number, such as a currency sign. */
  prefix?: string | undefined | null
  /** Text inside the field after the number, such as `%` or a unit. */
  suffix?: string | undefined | null
  /** Aligns the number to the right, as in a column of amounts. */
  textRight?: boolean | undefined | null
  /** Focuses the field when it mounts. */
  autofocus?: boolean | undefined | null
  /** Name submitted with a native form. */
  name?: string | undefined
  /** Accessible name when the visible `label` is not enough (or absent); with `hideDetails` the label is used. */
  ariaLabel?: string | undefined
  /** Id of the element that names the field, instead of `label`. */
  ariaLabelledby?: string | undefined
  /** Accessible name of the increment button. Default `Increase`. */
  incrementAriaLabel?: string | undefined
  /** Accessible name of the decrement button. Default `Decrease`. */
  decrementAriaLabel?: string | undefined
  /** Smaller padding, as on SInput. */
  dense?: boolean | undefined
  /** Removes the rounded corners. */
  tile?: boolean | undefined
} & PropsSizePreset &
  PropsFormInput
