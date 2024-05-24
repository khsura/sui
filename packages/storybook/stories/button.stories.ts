import { faker } from '@sui/shared'
import { SButton, SIcon } from '@sui/app/components'
import { argsButton } from '@sui/storybook/args'
import { argTypesButton, argTypesIcon } from '@sui/storybook/argTypes'
import { createStoryObj } from '@sui/storybook/helpers'
import { defineComponent } from 'vue'
import type { MaterialDesignIcon } from '@sui/app/types/index'
import type { ComponentPropsAndSlots, Meta } from '@storybook/vue3'

const button: Meta<typeof SButton> = {
  title: 'UI Components/Button',
  component: SButton,
  argTypes: argTypesButton,
}

export default button

export const Button = createStoryObj<typeof SButton>({
  render: (args) =>
    defineComponent({
      components: { SButton },
      setup() {
        return { args }
      },
      template: `
        <SButton v-bind="args" target="_blank" class="s_ma__3">{{ args.default }}</SButton>
      `,
    }),
  args: argsButton(),
})

export const ButtonIcon = createStoryObj<typeof SButton | { icon: MaterialDesignIcon }>({
  argTypes: {
    icon: argTypesIcon.icon,
  },
  args: { ...argsButton({ variant: 'icon' }), icon: 'mdi-heart-outline' },
  render: (args: ComponentPropsAndSlots<typeof SButton> & { icon: MaterialDesignIcon }) => {
    return defineComponent({
      components: { SButton, SIcon },
      setup() {
        return { args }
      },
      template: `<SButton class="s_ma__3" v-bind="args" :icon="!!args.icon">
        <SIcon :icon="args.icon"></SIcon>
      </SButton>`,
    })
  },
})

export const ButtonLink = createStoryObj<typeof SButton>({
  ...Button,
  args: argsButton({ default: faker.word.noun(), href: faker.internet.url() }),
})
