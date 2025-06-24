import { SRow, SCard, SColumn, gridAlignProperties, gridJustifyProperties } from '@khsura/sui/index'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

const grids: Meta<typeof SRow> = {
  title: 'UI Components/Grids/Row',
  argTypes: {
    align: {
      options: gridAlignProperties,
      control: { type: 'select' },
    },
    justify: {
      options: gridJustifyProperties,
      control: { type: 'select' },
    },
    noGutters: {
      type: { name: 'string', required: false },
      description: 'Removes paddings around the row and kColumns',
      control: {
        type: 'boolean',
      },
    },
    noOuterGutters: {
      type: { name: 'string', required: false },
      description: 'Removes default margins around the row',
      control: {
        type: 'boolean',
      },
    },
    gap: {
      type: { name: 'string', required: false },
      description: 'Sets the gap between columns',
      control: {
        type: 'number',
      },
    },
  },
}

export default grids

export const RowWithColumn: StoryObj<typeof SRow> = {
  render: (args) => {
    return {
      template: /* html */ `        
      <SRow style="border: 1px solid black;" v-bind="args">        
        <SColumn v-for="(style, i) in cards" :key="i" cols="auto">
          <SCard
            min-width="100"
            outlined
            :style="style"
            class="k_textAlign__center"
          >
            {{ i }}
          </SCard>
        </SColumn>
      </SRow>
      `,
      components: { SRow, SCard, SColumn },
      setup() {
        const cardCount = 4 + Math.floor(Math.random() * 10)

        const cards = Array(cardCount)
          .fill(0)
          .map(() => {
            return {
              minHeight: `${40 + Math.random() * 30}px`,
            }
          })

        return {
          args,
          cards,
        }
      },
    }
  },
  args: {
    noGutters: false,
    noOuterGutters: false,
    dense: false,
  },
}

export const RowWithoutColumn: StoryObj<typeof SRow> = {
  render: (args) => {
    return {
      template: /* html */ `        
      <SRow style="border: 1px solid black;" v-bind="args">        
        <SCard
          width="100px"
          v-for="(style, i) in cards" :key="i"
          outlined
          :style="style"
          class="k_textAlign__center"
        >
          {{ i }}
        </SCard>
      </SRow>
      `,
      components: { SRow, SCard, SColumn },
      setup() {
        const cardCount = 4 + Math.floor(Math.random() * 10)

        const cards = Array(cardCount)
          .fill(0)
          .map(() => {
            return {
              minHeight: `${40 + Math.random() * 30}px`,
            }
          })

        return {
          args,
          cards,
        }
      },
    }
  },
  args: {
    noGutters: false,
    noOuterGutters: false,
    dense: false,
  },
}
