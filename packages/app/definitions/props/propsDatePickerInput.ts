import type { PropsSizePreset } from './propsSizePreset'
import type { PropsDatePicker } from './propsDatePicker'
import type { PropsFormInput } from './propsFormInput'
import { type MaterialDesignIcon } from '@/app/types'

export type PropsDatePickerInput = {
  label?: string | null
  placeholder?: string | null
  simple?: boolean | null
  tile?: boolean
  /** Stretches the field to the width of its container. */
  block?: boolean
  /** Renders prev/next buttons that step the model value by one period. */
  carousel?: boolean
  carouselPrevIcon?: MaterialDesignIcon
  carouselNextIcon?: MaterialDesignIcon
  carouselPrevAriaLabel?: string | null
  carouselNextAriaLabel?: string | null
} & PropsDatePicker &
  PropsFormInput &
  PropsSizePreset
