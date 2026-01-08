import type { ArgTypes } from '@storybook/vue3'
import type { PropsPosition } from '@/app/index'

export const argTypesPosition: ArgTypes<PropsPosition> = {
  position: {
    control: 'select',
    options: [null, 'relative', 'absolute', 'fixed', 'sticky', 'static', 'initial', 'inherit'],
  },
}
