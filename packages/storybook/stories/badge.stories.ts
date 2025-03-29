import { SBadge, SButton, SIcon, SInput } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { argsBadge } from '@khsura/storybook/args'
import { argTypesBadge } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'
import { useBadgeService } from '@khsura/storybook/services'

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
