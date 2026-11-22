import { type PropsBorder, type PropsColor, type PropsContent } from './core'
import { type PropsFormInput } from './propsFormInput'
import { type PropsMenu } from './propsMenu'
import { type SelectItem } from '@/app/types'

export type PropsSelect = {
  name?: string | null
  items?: Array<SelectItem | string | undefined | null>
  label?: string | null
  /** Text shown in the field while nothing is selected. The label is never repeated inside the field. */
  placeholder?: string | null
  /** Accessible name when there is no visible `label` (otherwise the label names the field). */
  ariaLabel?: string | null
  dense?: boolean
  grow?: boolean
  text?: boolean
  divided?: boolean
  /** Message shown in the open menu when `items` is empty. Without it (and without the `noData` slot) an empty menu stays blank. Put an `SEmptyState` in the `noData` slot for an icon or an action. */
  noDataText?: string | undefined
} & PropsBorder &
  PropsMenu &
  PropsFormInput &
  PropsContent &
  PropsColor
