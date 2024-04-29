import { faker } from '@sui/shared'
import { SToggleButton, SToggleButtonGroup } from '@sui/app/components'
import { argTypesToggleButtonGroup } from '@sui/storybook/argTypes'
import { createStoryObj } from '@sui/storybook/helpers'
import { ref } from 'vue'
import type { Meta } from '@storybook/vue3'

const toggleButtonGroup: Meta<typeof SToggleButtonGroup> = {
  title: 'UI Components/Toggle Button Group',
  argTypes: argTypesToggleButtonGroup,
  args: {
    outlined: false,
    rounded: false,
    tile: false,
    dense: false,
    bordered: true,
    selectedColor: 'primary',
    variant: null,
    shrink: false,
    multiple: false,
    mandatory: false,
  },
}

export default toggleButtonGroup

export const ToggleButtonGroup = createStoryObj<typeof SToggleButtonGroup>({
  render: (args) => {
    return {
      components: {
        SToggleButton,
        SToggleButtonGroup,
      },
      setup() {
        const toggleButtons = ref([1, 5])
        const arrayLength = faker.helpers.rangeToNumber({ min: 5, max: 12 })
        const lastGridSize = arrayLength % 3 || 3
        const buttons = Array(arrayLength)
          .fill('')
          .map((v, i) => {
            const isLastGrid = arrayLength - i <= lastGridSize
            return {
              text: faker.word.noun(),
              cols: isLastGrid ? 12 / lastGridSize : 4,
            }
          })

        return {
          toggleButtons,
          buttons,
          args,
        }
      },
      template: /* html */ `
      <div>
        <SToggleButtonGroup
          v-bind="args"
          v-model="toggleButtons"
        >
          <SToggleButton v-for="(button, i) in buttons" :key="i" :cols="button.cols" md="grow">
            {{ button.text }}
          </SToggleButton>
        </SToggleButtonGroup>
      </div>
      `,
    }
  },
})
