import type { PropsPosition } from '@khsura/sui/index'
import type { ArgTypes } from '@storybook/vue3'

export const argTypesPosition: ArgTypes<PropsPosition> = {
  position: {
    control: 'select',
    options: [null, 'relative', 'absolute', 'fixed', 'sticky', 'static', 'initial', 'inherit'],
  },
}
