import { SBadge, SButton, SIcon, SInput } from '@sui/app/components'
import { argsBadge } from '@sui/storybook/args'
import { argTypesBadge } from '@sui/storybook/argTypes'
import { createStoryObj } from '@sui/storybook/helpers'
import { useBadgeService } from '@sui/storybook/services'
import type { Meta } from '@storybook/vue3'

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
