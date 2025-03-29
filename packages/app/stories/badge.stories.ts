import type { Meta } from '@storybook/vue3'
import SBadge from '~/components/badge/sBadge.vue'
import { SButton, SIcon, SInput } from '~/index'
import { argsBadge, argTypesBadge, createStoryObj, useBadgeService } from '~/storybook'

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
