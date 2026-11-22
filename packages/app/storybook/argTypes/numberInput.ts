import type { ArgTypes } from '@storybook/vue3'
import { argTypesSizePreset } from './core'
import { numberInputControlVariants } from '@/app/constants'
import type { PropsNumberInput } from '@/app/index'

export const argTypesNumberInput: Partial<ArgTypes<PropsNumberInput>> = {
  ...argTypesSizePreset,
  controlVariant: {
    type: { name: 'string', required: false },
    description: 'Layout of the increment and decrement buttons.',
    control: { type: 'select' },
    options: [null, ...numberInputControlVariants],
  },
}
