import { SButton, STooltip, SSheet, SRow, SContainer, SIcon, presetColors } from '@khsura/sui'
import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { argsColor } from '@khsura/storybook/args'
import { createStoryObj, getMarkdownArrayTypeDescription } from '@khsura/storybook/helpers'

const tooltip: Meta<typeof STooltip> = {
  title: 'UI Components/Tooltip',
  argTypes: {
    color: {
      control: { type: 'text' },
      table: {
        defaultValue: { summary: 'null' },
        type: {
          summary: 'PresetColorType | ExposedAppColorType | string',
          detail: getMarkdownArrayTypeDescription(presetColors) + " or `string` such as '#0071eb'",
        },
      },
    },
    location: {
      type: 'string',
      control: {
        type: 'select',
      },
      options: [null, 'top', 'right', 'bottom', 'left', 'top left', 'top right', 'bottom left', 'bottom right'],
    },
    offsetX: {
      type: 'number',
    },
    offsetY: {
      type: 'number',
    },
    opacity: {
      control: { type: 'number', min: 0, max: 1, step: 0.01 },
    },
    activator: {
      control: {
        type: 'text',
      },
    },
    default: {
      control: {
        type: 'object',
      },
    },
  },
}

export default tooltip

export const Template = createStoryObj<typeof STooltip>({
  render: (args) => {
    return {
      components: {
        STooltip,
        SButton,
        SIcon,
        SContainer,
        SRow,
      },
      setup() {
        return {
          args,
        }
      },
      template: /* html */ `
      <SContainer>
        <SRow justify="spaceBetween">
          <STooltip v-bind="args">
            <template #activator>
              <SButton>Tooltip 1</SButton>
            </template>
            Content 1
          </STooltip>
          <STooltip v-bind="args">
            <template #activator>
              <SIcon icon="mdi-help-circle" small></SIcon>
            </template>
            Content 2
          </STooltip>
        </SRow>
        <SRow justify="center">
          <STooltip v-bind="args">
            <template #activator>
              <SButton>Tooltip 3</SButton>
            </template>
            Content 3
          </STooltip>
        </SRow>
        <SRow justify="spaceBetween">
          <STooltip v-bind="args">
            <template #activator>
              <SIcon icon="mdi-help-circle" large></SIcon>
            </template>
            Content 4
          </STooltip>
          <STooltip v-bind="args">
            <template #activator>
              <SButton>Tooltip 5</SButton>
            </template>
            Content 5
          </STooltip>
        </SRow>
      </SContainer>
      `,
    }
  },
  args: {
    ...argsColor,
    color: undefined,
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
  },
})

export const TooltipWithProps = createStoryObj<typeof STooltip>({
  render: (args) => {
    return {
      components: {
        STooltip,
        SButton,
        SSheet,
        SRow,
      },
      setup() {
        const show = ref(false)

        const toggleShow = () => {
          show.value = !show.value
        }

        return {
          show,
          toggleShow,
          args,
        }
      },
      template: /* html */ `
      <SSheet>
        <SRow>
          <SButton id="tooltipExternalActivator" @click="toggleShow">Long long button text</SButton>
        </SRow>
        <SRow></SRow>
        <SRow justify="center">
          <STooltip v-bind="args" v-model="show" activator="#tooltipExternalActivator">
            Content 1
          </STooltip>
        </SRow>
      </SSheet>
      `,
    }
  },
  args: {
    ...argsColor,
    color: 'secondary',
    opacity: 1,
    offsetX: 0,
    offsetY: 0,
  },
})
