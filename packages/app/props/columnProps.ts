import { type PropType } from 'vue'
import { gridColumns } from '@khsura/sui/constants/app'
import { isOptionalNumeric, orderValidator } from '@khsura/sui/repositories/columnRepository'

export const propsColumn = () => {
  return {
    cols: {
      type: [Number, String] as PropType<null | number | string | undefined>,
      default: null,
      validator: isOptionalNumeric({ min: 1, max: gridColumns, whitelist: ['auto', 'grow'] }),
    },
    sm: {
      type: [Number, String] as PropType<null | number | string | undefined>,
      default: null,
      validator: isOptionalNumeric({ min: 1, max: gridColumns, whitelist: ['auto', 'grow'] }),
    },
    md: {
      type: [Number, String] as PropType<null | number | string | undefined>,
      default: null,
      validator: isOptionalNumeric({ min: 1, max: gridColumns, whitelist: ['auto', 'grow'] }),
    },
    lg: {
      type: [Number, String] as PropType<null | number | string | undefined>,
      default: null,
      validator: isOptionalNumeric({ min: 1, max: gridColumns, whitelist: ['auto', 'grow'] }),
    },
    order: {
      type: [Number, String] as PropType<null | number | string | undefined>,
      default: null,
      validator: orderValidator({ min: 0, max: gridColumns }),
    },
    alignSelf: {
      type: String as PropType<
        | 'auto'
        | 'normal'
        | 'center'
        | 'start'
        | 'end'
        | 'self-start'
        | 'self-end'
        | 'flex-start'
        | 'flex-end'
        | 'baseline'
        | 'first baseline'
        | 'last baseline'
        | 'stretch'
        | 'safe center'
        | 'unsafe center'
        | 'inherit'
        | 'initial'
        | 'revert'
        | 'revert-layer'
        | 'unset'
        | null
        | undefined
      >,
      default: null,
    },
  }
}
