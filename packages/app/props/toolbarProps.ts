import { type PropType } from 'vue'
import { toolbarDensities } from '@khsura/sui/configs/toolbar'
import { defaultToolbarContentHeight, defaultToolbarExtensionHeight } from '@khsura/sui/constants/toolbar'
import { type ToolbarDensityType } from '@khsura/sui/types'
import { propsBorder } from './core/borderProps'
import { propsColor } from './core/colorProps'
import { propsContent } from './core/contentProps'
import { propsElevation } from './core/elevationProps'
import { propsTag } from './core/tagProps'
import { propsPosition } from './positionProps'

export const propsToolbar = (defaults?: { elevation?: number; tag?: 'div' | 'section' | 'header'; color?: string }) => {
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
    extensionStyle: {
      type: Object as PropType<Record<string, string> | undefined>,
      default: undefined,
    },
    extensionClass: {
      type: [String, Object] as PropType<string | Record<string, boolean | undefined> | undefined>,
      default: undefined,
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
    ...propsColor(defaults),
    ...propsBorder(),
    ...propsElevation(defaults),
    ...propsPosition(),
  }
}
