import { toolbarDensities } from '@sui/app/configs/toolbar'
import { defaultToolbarContentHeight, defaultToolbarExtensionHeight } from '@sui/app/constants/toolbar'
import { type PropType } from 'vue'
import { type ToolbarDensityType } from '@sui/app/types'
import { propsBorder } from './core/borderProps'
import { propsColor } from './core/colorProps'
import { propsContent } from './core/contentProps'
import { propsElevation } from './core/elevationProps'
import { propsTag } from './core/tagProps'
import { propsPosition } from './positionProps'

export const propsToolbar = (defaults?: { elevation?: number; tag?: 'div' | 'section' | 'header' }) => {
  return {
    density: {
      type: String as PropType<ToolbarDensityType | null | undefined>,
      default: 'default',
      validator: (v: string | null | undefined) => toolbarDensities.includes(v),
    },
    extended: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: null,
    },
    extensionHeight: {
      type: [Number, String] as PropType<number | string | undefined>,
      default: defaultToolbarExtensionHeight,
    },
    floating: {
      type: Boolean as PropType<boolean | undefined>,
      default: false,
    },
    height: {
      type: [Number, String] as PropType<number | string | null | undefined>,
      default: defaultToolbarContentHeight,
    },
    title: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    ...propsContent(),
    ...propsTag({ tag: defaults?.tag }),
    ...propsColor(),
    ...propsBorder(),
    ...propsElevation(defaults),
    ...propsPosition(),
  }
}
