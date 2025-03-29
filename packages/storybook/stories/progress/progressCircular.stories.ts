import { SProgressCircular } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { argsComponentTheme } from '@khsura/storybook/args'
import { argTypesComponentTheme } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'

const progressCircular: Meta<typeof SProgressCircular> = {
  title: 'UI Components/Progress Bar/Circular',
  component: SProgressCircular,
  argTypes: {
    ...argTypesComponentTheme,
    value: {
      type: { required: false, name: 'number' },
      description: 'progress value',
      table: { defaultValue: { summary: '0' } },
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      type: { name: 'number', required: false },
      table: { defaultValue: { summary: '32', detail: 'number | string' } },
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
    rotate: {
      type: { required: false, name: 'union', value: [{ name: 'number' }, { name: 'string' }] },
      description: 'Gives the ability to customize the origin.',
      table: { defaultValue: { summary: 'null', detail: 'number | string' } },
      control: {
        type: 'number',
      },
    },
    width: {
      type: { name: 'number', required: false },
      table: { defaultValue: { summary: '4', detail: 'number' } },
    },
  },
  args: {
    ...argsComponentTheme,
  },
}

export default progressCircular

export const ProgressCircular = createStoryObj<typeof SProgressCircular>({
  render: (args) => {
    return {
      template: /* html */ `
        <SProgressCircular v-bind="args">{{ args.value }}</SProgressCircular>
      `,
      components: { SProgressCircular },
      setup() {
        return { args }
      },
    }
  },
  args: {
    color: '',
    value: 45,
    size: '32',
    indeterminate: false,
    width: 4,
  },
})
