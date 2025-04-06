import { type PropsBorder } from './core'
import { type PropsFormInput } from './propsFormInput'
import { type PropsSingleGroup } from './propsSingleGroup'

export type PropsRadioGroup = {
  name: string
  grow?: boolean | null
  color?: string | null
  column?: boolean | null
} & PropsBorder &
  PropsFormInput &
  PropsSingleGroup
