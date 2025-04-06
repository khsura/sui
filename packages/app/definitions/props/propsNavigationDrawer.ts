import { type ComponentPublicInstance } from 'vue'
import { type PropsElevation, type PropsLocation, type PropsTag, type PropsPosition } from './core'
import { type PropsLayout } from './propsLayout'

export type PropsNavigationDrawer = {
  modelValue?: boolean | null
  activator?: HTMLElement | ComponentPublicInstance | string | null
  miniVariant?: boolean
  miniVariantWidth?: string | number
  permanent?: boolean
  expandOnHover?: boolean
  forceMobile?: boolean
  hideOverlay?: boolean
  touchless?: boolean
  height?: string | number | null
  width?: string | number
} & PropsLayout &
  PropsLocation &
  PropsPosition &
  PropsElevation &
  PropsTag<'nav' | 'div' | 'section'>
