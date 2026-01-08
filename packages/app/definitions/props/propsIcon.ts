import { type PropsTextColor } from './core/propsTextColor'
import { type PropsComponentTheme } from './core/propsComponentTheme'
import { type PropsSizeUnion } from './propsSizeUnion'
import { type MaterialDesignIcon, type MaterialDesignIconExtra } from '@/app/types'

export type PropsIcon = {
  icon: MaterialDesignIcon
  extra?: Array<MaterialDesignIconExtra | string> | null
  rotated?: boolean | null
  spin?: boolean
} & PropsSizeUnion &
  PropsTextColor &
  PropsComponentTheme
