import type { Meta } from '@storybook/vue3-vite'
import { SBadge, SButton, SIcon, SInput } from '@/app/index'
import { argsBadge } from '@/app/storybook/args'
import { argTypesBadge } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'
import { useBadgeService } from '@/app/storybook/services'

const badge: Meta<typeof SBadge> = {
  title: 'UI Components/Badge',
  argTypes: argTypesBadge,
}

export default badge

const components = {
  SBadge,
  SButton,
  SInput,
  SIcon,
}

export const Badge = createStoryObj<typeof SBadge>({
  render: (args) => {
    return {
      template: /* html */ `
      <div class="s_pa__10">
        <SBadge v-bind="args">
          <SIcon icon="mdi-cart"></SIcon>
        </SBadge>
      </div>
    `,
      components,
      setup() {
        return useBadgeService(args)
      },
    }
  },
  args: argsBadge,
})

export const BadgeWithSlot = createStoryObj<typeof SBadge>({
  render: (args) => {
    return {
      components,
      template: /* html */ `
      <div class="s_pa__10">
        <SBadge v-bind="args">
          <template #badge>
            <SIcon :icon="args.icon"></SIcon> {{ args.badge }}
          </template>
          <SIcon icon="mdi-cart"></SIcon>
        </SBadge>
      </div>
    `,
      setup() {
        return useBadgeService(args)
      },
    }
  },
  args: { ...argsBadge, icon: 'mdi-circle' },
})
