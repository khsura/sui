import { SSheet } from '@khsura/sui/components'
import { argsColor } from '@khsura/storybook/args'
import { argTypesColor } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'

import type { Meta } from '@storybook/vue3'

const sheet: Meta<typeof SSheet> = {
  title: 'UI Components/Sheet',
  component: SSheet,
  argTypes: {
    ...argTypesColor,
    elevation: {
      type: 'number',
      control: 'text',
      table: {
        defaultValue: {
          summary: 'null',
        },
        type: {
          summary: 'number',
        },
      },
    },
  },
}

export default sheet

export const Sheet = createStoryObj<typeof SSheet>({
  render: (args) => {
    return {
      components: {
        SSheet,
      },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SSheet v-bind="args">
          <h1>Simple Sheet</h1>
          <p>if you want to use plain block element that can be modified easily, you can use this</p>
        </SSheet>
      `,
    }
  },
  args: {
    elevation: null,
    ...argsColor,
    color: 'warning',
  },
})
