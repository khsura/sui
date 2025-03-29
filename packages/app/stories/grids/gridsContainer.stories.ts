import type { Meta } from '@storybook/vue3'
import { SContainer, SCard, SCardText } from '~/index'
import { createStoryObj } from '~/storybook'

const container: Meta<typeof SContainer> = {
  title: 'UI Components/Grids/Container',
  argTypes: {
    tag: {
      options: ['div', 'section'],
      control: { type: 'select' },
    },
    fill: {
      type: { name: 'string', required: false },
      description: 'Background use cars color',
      control: {
        type: 'boolean',
      },
    },
    narrow: {
      type: { name: 'string', required: false },
      description: 'Sets max-width: 800px',
      control: {
        type: 'boolean',
      },
    },
    fluid: {
      type: { name: 'string', required: false },
      description: 'Removes viewport maximum-width size breakpoints.',
      control: {
        type: 'boolean',
      },
    },
    color: {
      type: { name: 'string', required: false },
      control: {
        type: 'color',
      },
    },
  },
}

export default container

export const Container = createStoryObj<typeof SContainer>({
  render: (args) => {
    return {
      components: { SContainer, SCard, SCardText },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SContainer v-bind="args">
          <SCard color="transparent">
            <SCardText>Container</SCardText>
          </SCard>
        </SContainer>
      `,
    }
  },
  args: {
    fill: false,
    tag: 'div',
    narrow: false,
    fluid: false,
    color: '',
  },
})
