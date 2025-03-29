import { SIcon, sizeProperties, presetColors, SizeProperty } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { argsComponentTheme } from '@khsura/storybook/args'
import { argTypesComponentTheme, argTypesIcon } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'

const icon: Meta<typeof SIcon> = {
  title: 'UI Components/Icon',
  component: SIcon,
  argTypes: {
    color: {
      control: { type: 'text' },
      description: presetColors.join(', '),
    },
    size: {
      options: sizeProperties,
      control: { type: 'select' },
    },
    rotated: {
      control: { type: 'boolean' },
    },
    spin: {
      control: { type: 'boolean' },
    },
    extra: {
      control: { type: 'object' },
      required: false,
    },
    ...argTypesIcon,
    ...argTypesComponentTheme,
  },
  args: {
    ...argsComponentTheme,
  },
}

export default icon

export const BasicIcon = createStoryObj<typeof SIcon>({
  render: (args) => {
    return {
      components: { SIcon },
      setup() {
        return { args }
      },
      template: `
        <SIcon v-bind="args" class="s_ma__3"></SIcon>
      `,
    }
  },
  args: {
    color: 'primary',
    size: SizeProperty.default,
    icon: 'mdi-rabbit',
    extra: [],
    spin: false,
    rotated: false,
  },
  parameters: {
    controls: {
      exclude: ['builtinIcon'],
    },
  },
})

export const BuiltinLoadingIcon = createStoryObj<typeof SIcon>({
  render: (args) => {
    return {
      components: { SIcon },
      setup() {
        return {
          args,
        }
      },
      template: `
      <div class="s_pa__3"><SIcon v-bind="args"></SIcon></div>
    `,
    }
  },
  args: {
    spin: false,
    rotated: false,
    icon: 'mdi-camera-outline',
  },
  parameters: {
    controls: {
      exclude: ['icon'],
    },
  },
})
