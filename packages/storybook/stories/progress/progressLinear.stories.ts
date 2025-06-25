import { SProgressLinear } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { argTypesComponentTheme } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'
import { argTypesPosition } from '@khsura/storybook/argTypes/core/position'

const progressLinear: Meta<typeof SProgressLinear> = {
  title: 'UI Components/Progress Bar/Linear',
  component: SProgressLinear,
  argTypes: {
    ...argTypesComponentTheme,
    ...argTypesPosition,
    value: {
      type: { required: false, name: 'union', value: [{ name: 'number' }, { name: 'string' }] },
      description: 'progress value',
      table: { defaultValue: { summary: 'null', detail: 'number | string' } },
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      type: { required: false, name: 'union', value: [{ name: 'number' }, { name: 'string' }] },
      description: 'progress line thickness',
      table: { defaultValue: { summary: 'null', detail: 'number | string' } },
      control: {
        type: 'number',
      },
    },
    indeterminate: {
      type: { name: 'string', required: false },
      description: 'Using this prop, a component continues to animate indefinitely.',
      control: {
        type: 'boolean',
      },
    },
    backgroundOpacity: {
      type: { required: false, name: 'union', value: [{ name: 'number' }, { name: 'string' }] },
      description:
        'Background opacity, if null it defaults to 0.3 if background color is not specified or 1 otherwise.',
      table: { defaultValue: { summary: '0.3', detail: 'number | string' } },
      control: { type: 'range', min: 0.0, max: 1.0, step: 0.1 },
    },
    backgroundColor: {
      control: { type: 'color' },
    },
  },
}

export default progressLinear

export const ProgressLinear = createStoryObj<typeof SProgressLinear>({
  render: (args) => {
    return {
      template: /* html */ `
        <SProgressLinear v-bind="args">{{ args.value }}</SProgressLinear>
      `,
      components: { SProgressLinear },
      setup() {
        return { args }
      },
    }
  },
  args: {
    color: '',
    value: 45,
    indeterminate: false,
    position: 'relative',
  },
})
