import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { sPositionDemo } from '@khsura/storybook/components'

const meta: Meta<typeof sPositionDemo> = {
  title: 'Styles & Animations/Position',
  component: sPositionDemo,
  argTypes: {
    positionSettings: {
      type: 'string',
      control: 'select',
      options: ['unset', 'static', 'relative', 'absolute', 'fixed', 'sticky'],
    },
    topShift: {
      control: { type: 'range', min: -135, max: 135, step: 1 },
    },
    leftShift: {
      control: { type: 'range', min: -135, max: 135, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof sPositionDemo>

export const Position: Story = {
  render: (args) => ({
    name: 'Position',
    components: { sPositionDemo },
    setup() {
      return { args }
    },
    template: '<sPositionDemo v-bind="args"></sPositionDemo>',
  }),
}
