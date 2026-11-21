import { faker } from '@khsura/shared'
import type { ComponentPropsAndSlots, Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { SButton, SIcon } from '@/app/index'
import type { MaterialDesignIcon } from '@/app/index'
import { argsButton } from '@/app/storybook/args'
import { argTypesButton, argTypesIcon } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const button: Meta<typeof SButton> = {
  title: 'UI Components/Button',
  component: SButton,
  argTypes: argTypesButton,
}

export default button

// Stories tagged `visual` are plain object literals: Storybook's static indexer only reads tags from those.
// They are screenshotted by the visual regression harness (docs/visual-testing.md).
export const Button = {
  tags: ['visual'],
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
} satisfies StoryObj<typeof SButton>

export const ButtonIcon = {
  tags: ['visual'],
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
      template: `<SButton class="s_ma__3" v-bind="args" :icon="!!args.icon" aria-label="Like">
        <SIcon :icon="args.icon"></SIcon>
      </SButton>`,
    })
  },
} satisfies StoryObj<typeof SButton | { icon: MaterialDesignIcon }>

export const ButtonLink = createStoryObj<typeof SButton>({
  ...Button,
  args: argsButton({ default: faker.word.noun(), href: faker.internet.url() }),
})
