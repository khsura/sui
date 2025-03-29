import type { Meta } from '@storybook/vue3'
import { SRow, SColumn, SCard } from '~/index'
import { createStoryObj } from '~/storybook'

const grids: Meta<typeof SColumn> = {
  title: 'UI Components/Grids/Column',
  argTypes: {
    cols: {
      control: {
        type: 'number',
      },
    },
    sm: {
      control: {
        type: 'number',
      },
    },
    md: {
      control: {
        type: 'number',
      },
    },
    lg: {
      control: {
        type: 'number',
      },
    },
    order: {
      control: {
        type: 'number',
      },
    },
  },
}

export default grids

export const Column = createStoryObj<typeof grids>({
  render: (args) => {
    return {
      template: /* html */ `        
      <SRow style="border: 1px solid black;">
        <SColumn>
          <SCard
            outlined
            :style="variableHeight()"
            class="s_textAlign__center"
            v-bind="args"
          >
            order {{ args.order }}
          </SCard>
        </SColumn>
        <SColumn v-bind="args">
          <SCard
            outlined
            :style="variableHeight()"
            class="s_textAlign__center"
          >
            order 2
          </SCard>
        </SColumn>
        <SColumn v-for="i in 10" :key="i" v-bind="args">
          <SCard
            outlined
            :style="variableHeight()"
            class="s_textAlign__center"
          >
            {{ i }}
          </SCard>
        </SColumn>        
      </SRow>
      `,
      components: { SRow, SColumn, SCard },
      setup() {
        const variableHeight = () => ({ 'min-height': `${40 + Math.random() * 30}px`, height: '100%' })

        return {
          args,
          variableHeight,
        }
      },
    }
  },
  args: {
    cols: null,
    sm: null,
    md: null,
    lg: null,
    order: null,
  },
})
