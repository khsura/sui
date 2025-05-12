import { type PropsColumn } from './propsColumn'

export type PropsTab = {
  tab: string | number
  disabled?: boolean
} & PropsColumn
