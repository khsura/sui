// import { STransition } from '@khsura/sui'
import type { PropsBadge } from '@khsura/sui'
import { type ArgTypes } from '@storybook/vue3'
import { argTypesColor, argTypesIcon, argTypesTransition } from './core'

export const argTypesBadge: Partial<ArgTypes<PropsBadge>> = {
  value: {
    type: { name: 'string', required: false },
    description: 'Boolean flag for visibility',
    table: { defaultValue: { summary: 'false', detail: 'boolean | null | undefined' } },
    control: {
      type: 'boolean',
    },
  },
  content: {
    type: { name: 'string', required: false },
    table: { defaultValue: { summary: 'null', detail: '[String, Number] as PropType<string | number | null>' } },
    description: 'For simple text, use the <b>content</b> property to display a value on the badge.',
    control: {
      type: 'text',
    },
  },
  offsetX: {
    description: 'Offset the badge on the x-axis. Has validatorNumericCssAttribute.',
    table: { defaultValue: { summary: 'null', detail: '[Number, String] as PropType<string | number | null>' } },
    control: {
      type: 'text',
    },
  },
  offsetY: {
    type: 'string',
    description: 'Offset the badge on the y-axis. Has validatorNumericCssAttribute.',
    table: { defaultValue: { summary: 'null', detail: '[Number, String] as PropType<string | number | null>' } },
    control: {
      type: 'text',
    },
  },
  overlap: {
    type: { name: 'boolean', required: false },
    table: { defaultValue: { summary: 'false', detail: 'boolean | null | undefined' } },
    description: 'overlapping the content of default slot.',
    control: {
      type: 'boolean',
    },
  },
  dot: {
    type: { name: 'boolean', required: false },
    table: { defaultValue: { summary: 'false', detail: 'boolean | null | undefined' } },
    description: 'The dot property removes badge’s <b>content</b> and reduces its overall size.',
    control: {
      type: 'boolean',
    },
  },
  inline: {
    type: { name: 'boolean', required: false },
    table: { defaultValue: { summary: 'false', detail: 'boolean' } },
    description: 'Moves the badge to be inline with the wrapping element.',
    control: {
      type: 'boolean',
    },
  },
  bottom: {
    type: { name: 'boolean', required: false },
    table: { defaultValue: { summary: 'false', detail: 'boolean | null | undefined' } },
    description: 'Aligns the component towards the bottom.',
    control: {
      type: 'boolean',
    },
  },
  left: {
    type: { name: 'boolean', required: false },
    table: { defaultValue: { summary: 'false', detail: 'boolean | null | undefined' } },
    description: 'Aligns the component towards the left.',
    control: {
      type: 'boolean',
    },
  },
  tile: {
    type: { name: 'boolean', required: false },
    table: { defaultValue: { summary: 'false', detail: 'boolean | null | undefined' } },
    description: 'Removes the component’s border-radius.',
    control: {
      type: 'boolean',
    },
  },
  colorThreshold: {
    ...argTypesColor.colorThreshold,
  },
  ...argTypesIcon,
  ...argTypesTransition,
}
