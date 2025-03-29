import { faker } from '@khsura/shared'
import type { ComponentPropsAndSlots, Meta } from '@storybook/vue3'
import { defineComponent } from 'vue'
import { SButton, SIcon } from '~/index'
import type { MaterialDesignIcon } from '~/index'
import { argsButton, argTypesButton, argTypesIcon, createStoryObj } from '~/storybook'

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
