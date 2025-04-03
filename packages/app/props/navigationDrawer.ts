import { type PropType, type ComponentPublicInstance } from 'vue'
import { validatorNumericCssAttribute } from '@khsura/sui/validators'
import { propsLocation } from './core'
import { propsElevation } from './core/elevationProps'
import { propsTag } from './core/tagProps'
import { propsLayout } from './layoutProps'
import { propsPosition } from './positionProps'

export const propsNavigationDrawer = (defaults?: { app?: boolean }) => {
  return {
    ...propsLayout(defaults),
    modelValue: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    activator: {
      type: [String, Object] as PropType<HTMLElement | ComponentPublicInstance | string>,
      default: null,
    },
    miniVariant: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    miniVariantWidth: {
      type: [Number, String] as PropType<string | number | undefined>,
      default: 56,
      validator: validatorNumericCssAttribute,
    },
    permanent: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    expandOnHover: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    forceMobile: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    // disableRouteWatcher: {
    //   type: Boolean as PropType<boolean>,
    //   default: false,
    // },
    hideOverlay: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    touchless: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    height: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: null,
    },
    width: {
      type: [Number, String] as PropType<string | number | undefined>,
      validator: validatorNumericCssAttribute,
      default: 256,
    },
    ...propsLocation(),
    ...propsPosition(),
    ...propsElevation(),
    ...propsTag<'nav' | 'div' | 'section'>(),
  }
}
