import { type PropsBorder, type PropsColor, type PropsContent } from './core'
import { type PropsFormInput } from './propsFormInput'
import { type PropsMenu } from './propsMenu'
import { type SelectItem } from '@/app/types'

export type PropsSelect = {
  name?: string | null
  items?: Array<SelectItem | string | undefined | null>
  label?: string | null
  dense?: boolean
  grow?: boolean
  text?: boolean
  divided?: boolean
} & PropsBorder &
  PropsMenu &
  PropsFormInput &
  PropsContent &
  PropsColor
