import type { ArgTypes } from '@storybook/vue3'
import { FileInputDisplay, FileInputVariant } from '@/app/constants'
import type { PropsFileInput } from '@/app/definitions'

const displayOptions = Object.values(FileInputDisplay)
const variantOptions = Object.values(FileInputVariant)

export const argTypesFileInput: ArgTypes<Pick<PropsFileInput, 'display' | 'variant'>> = {
  display: {
    options: displayOptions,
    control: { type: 'select' },
    description: 'How the chosen files are shown.',
    table: {
      defaultValue: { summary: `'${FileInputDisplay.names}'` },
      type: { summary: displayOptions.join(' | ') },
    },
  },
  variant: {
    options: variantOptions,
    control: { type: 'select' },
    description: 'A text-field box, or a drop zone that also takes dragged files.',
    table: {
      defaultValue: { summary: `'${FileInputVariant.input}'` },
      type: { summary: variantOptions.join(' | ') },
    },
  },
}
